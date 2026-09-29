import type { Project } from "@/consts";
import { GITHUB_TOKEN } from "astro:env/server";

const API = "https://api.github.com";
const FETCH_TIMEOUT_MS = 8_000;

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ren-portfolio (build-time fetch)",
};
if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** ISO date of the latest commit on `owner/repo`, or null on any failure. */
export async function fetchLatestCommitDate(
  slug: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${API}/repos/${slug}/commits?per_page=1`, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[github] commit fetch failed for ${slug}: ${res.status}`);
      return null;
    }
    const json = (await res.json()) as Array<{
      commit?: { committer?: { date?: string }; author?: { date?: string } };
    }>;
    const commit = json?.[0]?.commit;
    return commit?.committer?.date ?? commit?.author?.date ?? null;
  } catch (err) {
    console.warn("[github] fetchLatestCommitDate failed:", err);
    return null;
  }
}

/**
 * Fetch the given user's pinned GitHub repos for use as portfolio entries.
 * Needs GITHUB_TOKEN (GraphQL requires auth). Returns null on any failure so
 * callers can fall back to a static list.
 */
export async function fetchPinnedProjects(
  username: string,
): Promise<Project[] | null> {
  if (!GITHUB_TOKEN) {
    console.warn("[github] GITHUB_TOKEN not set; using static PROJECTS.");
    return null;
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
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

  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: username } }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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

    return nodes.map((n) => ({
      // "android_kernel_xiaomi_gale" -> "Android Kernel Xiaomi Gale"
      title: n.name
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/(^| )\w/g, (c) => c.toUpperCase()),
      href: n.url,
      date: formatDate(n.pushedAt || n.updatedAt),
      description: n.description?.trim() || "No description provided.",
    }));
  } catch (err) {
    console.warn("[github] fetchPinnedProjects failed:", err);
    return null;
  }
}
