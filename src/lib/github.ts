import type { Project } from "@/consts";

type RepoMetadata = {
  full_name: string;
  html_url: string;
  description: string | null;
  pushed_at: string;
  updated_at: string;
};

const REST_BASE = "https://api.github.com";
const GRAPHQL_URL = "https://api.github.com/graphql";
const USER_AGENT = "ren-portfolio (build-time fetch)";
const FETCH_TIMEOUT_MS = 8_000;

function readToken(): string | undefined {
  const metaToken = (
    import.meta.env as Record<string, string | undefined>
  ).GITHUB_TOKEN?.trim();
  if (metaToken) return metaToken;
  if (typeof process !== "undefined") {
    return process.env.GITHUB_TOKEN?.trim() || undefined;
  }
  return undefined;
}

function baseHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  const token = readToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function titleCase(repoName: string): string {
  // "android_kernel_xiaomi_gale" -> "Android Kernel Xiaomi Gale"
  return repoName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function toProject(repo: RepoMetadata): Project {
  const [, name] = repo.full_name.split("/");
  return {
    title: titleCase(name ?? repo.full_name),
    href: repo.html_url,
    date: formatDate(repo.pushed_at || repo.updated_at),
    description: repo.description?.trim() || "No description provided.",
  };
}

// GraphQL path — needs GITHUB_TOKEN. One request returns everything.
async function fetchViaGraphQL(username: string): Promise<Project[] | null> {
  const token = readToken();
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              nameWithOwner
              url
              description
              pushedAt
              updatedAt
            }
          }
        }
      }
    }
  `;

  const res = await fetchWithTimeout(GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...baseHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  if (!res.ok) {
    console.warn(`[github] GraphQL request failed: ${res.status}`);
    return null;
  }

  const json = (await res.json()) as {
    data?: {
      user?: {
        pinnedItems?: {
          nodes?: Array<{
            name: string;
            nameWithOwner: string;
            url: string;
            description: string | null;
            pushedAt: string;
            updatedAt: string;
          }>;
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    console.warn(
      "[github] GraphQL errors:",
      json.errors.map((e) => e.message).join("; "),
    );
    return null;
  }
  const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
  if (!nodes.length) return null;

  return nodes.map((n) =>
    toProject({
      full_name: n.nameWithOwner,
      html_url: n.url,
      description: n.description,
      pushed_at: n.pushedAt,
      updated_at: n.updatedAt,
    }),
  );
}

// Scrape the public profile page to find the pinned repo slugs. GitHub
// wraps the pinned grid in `<ol class="... js-pinned-items-reorder-container">…</ol>`;
// we slice from that marker to the matching `</ol>` and pull every
// `href="/owner/repo"` inside. /forks and /stargazers anchors are naturally
// excluded since their hrefs contain a third path segment.
async function scrapePinnedSlugs(username: string): Promise<string[]> {
  const res = await fetchWithTimeout(`https://github.com/${username}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
    },
  });
  if (!res.ok) {
    console.warn(`[github] profile fetch failed: ${res.status}`);
    return [];
  }
  const html = await res.text();

  const containerStart = html.indexOf("js-pinned-items-reorder-container");
  if (containerStart === -1) return [];
  const containerEnd = html.indexOf("</ol>", containerStart);
  const region =
    containerEnd === -1
      ? html.slice(containerStart, containerStart + 50_000)
      : html.slice(containerStart, containerEnd);

  const slugs: string[] = [];
  const seen = new Set<string>();
  const re = /href="\/([^"\/]+\/[^"\/?#]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(region))) {
    const slug = m[1];
    if (!seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }
  return slugs.slice(0, 6);
}

async function fetchRepo(slug: string): Promise<RepoMetadata | null> {
  const res = await fetchWithTimeout(`${REST_BASE}/repos/${slug}`, {
    headers: baseHeaders(),
  });
  if (!res.ok) {
    console.warn(`[github] repo fetch failed for ${slug}: ${res.status}`);
    return null;
  }
  return (await res.json()) as RepoMetadata;
}

async function fetchViaScrape(username: string): Promise<Project[] | null> {
  const slugs = await scrapePinnedSlugs(username);
  if (!slugs.length) return null;

  const results = await Promise.all(slugs.map(fetchRepo));
  const projects = results
    .filter((r): r is RepoMetadata => r !== null)
    .map(toProject);
  return projects.length ? projects : null;
}

/**
 * Fetch the given user's pinned GitHub repos for use as portfolio entries.
 * Returns null on any failure so callers can fall back to a static list.
 * Set the optional GITHUB_TOKEN env var to use the GraphQL path (avoids
 * the 60/hr unauthenticated REST limit and the HTML-scrape fragility).
 */
export async function fetchPinnedProjects(
  username: string,
): Promise<Project[] | null> {
  if (!username) return null;
  try {
    const viaGraphQL = await fetchViaGraphQL(username);
    if (viaGraphQL?.length) return viaGraphQL;
    return await fetchViaScrape(username);
  } catch (err) {
    console.warn("[github] fetchPinnedProjects failed:", err);
    return null;
  }
}
