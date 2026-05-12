export const SITE_TITLE = "Aman";
export const SITE_DESCRIPTION =
  `Hi, I'm Aman, known as Ren Kagiyanagi or some other aliases on the internet. I am a self-taught engineer (kind of) and a tech enthusiast from India. Explore my portfolio built which showcases my projects and skills.`.trim();
export const SEO_KEYWORDS = [
  "Aman",
  "Aqua",
  "Kagiyanagi",
  "Ren Kagiyanagi",
  "Ren",
  "Aman Kagiyanagi",
  "Aqua Ren",
  "Kagiyanagi Ren",
  "Aman Aqua",
  "Aman portfolio",
  "Aman developer",
  "Aman engineer",
  "Aman web developer",
  "Aman Android",
  "Aman graphics",
  "Aman GFX",
  "Aman India",
].join(", ");
export const TWITTER_HANDLE = "@kagiyanagi";

export const KNOWN_TECH =
  `Astro,Tailwind CSS,JavaScript,Python,CSS,HTML,C,C++,Bash,VIM,React,Git,Photoshop,Figma,Pandas,NumPy,Hyprland, Davinci Resolve, Docker`.split(
    ",",
  );

// Toggle: when true, the homepage fetches pinned repos from
// https://github.com/${GITHUB_USERNAME} at build time and renders them
// instead of the static PROJECTS list below. PROJECTS is still used as a
// fallback if the fetch fails (network error, GitHub HTML change, etc.).
// Forkers who'd rather hand-curate their projects can flip this to false.
export const USE_PINNED_REPOS = true;

export type Project = {
  title: string;
  href: string;
  date: string;
  description: string;
};

export const PROJECTS: readonly Project[] = [
  {
    title: "C2Fetch",
    href: "https://github.com/kagiyanagi/c2fetch",
    date: "May 15, 2025",
    description: "A sleek CPU temperature monitor based by psutil. \u{1F321}",
  },
  {
    title: "Aquamarine kernel.",
    href: "https://github.com/kagiyanagi/android_kernel_xiaomi_gale",
    date: "Jul 22, 2025",
    description:
      '"Overclocked custom kernel for Poco C65/Redmi 13C(Gale/Gust)"',
  },
  {
    title: "ToDo in HCJ",
    href: "https://github.com/isaacaman/todo-hcj",
    date: "Aug 4, 2023",
    description:
      "A real useable ToDo application in plane HTML CSS and javaScript",
  },
  {
    title: "TicTacToe",
    href: "https://github.com/isaacaman/TicTacToe",
    date: "May 14, 2024",
    description: "My First Cpp Game Tic Tac Toe.",
  },
];
export const ABOUT_ME =
  `I'm a self-taught engineer from India, currently in high school. My interests cover web development, Android (core), low-level systems, graphic design, IoT, and machine learning. I also enjoy anime and music, which inspire my creative work — I'm committed to continuous learning and building projects that matter.`.trim();
export const GITHUB_USERNAME = "kagiyanagi";
export const GITHUB_REPO = `${GITHUB_USERNAME}/ren`;
export const NAV_LINKS: Array<{ title: string; href?: string }> = [
  {
    title: "Telegram",
    href: "//t.me/rensakashvani",
  },
  {
    title: "Github",
    href: "//github.com/" + GITHUB_USERNAME,
  },
  {
    title: "YouTube",
    href: "//youtube.com/@kagiyanagi",
  },
  {
    title: "Ko-fi",
    href: "//ko-fi.com/kagiyanagi",
  },
  {
    title: "X",
    href: "//x.com/kagiyanagi",
  },
];
