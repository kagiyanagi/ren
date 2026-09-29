export const SITE_TITLE = "Aman";
export const SITE_DESCRIPTION =
  `Hi, I'm Aman, known as Ren Kagiyanagi or some other aliases on the internet. I am a self-taught engineer (kind of) and a tech enthusiast from India. Explore my portfolio built which showcases my projects and skills.`.trim();
export const TWITTER_HANDLE = "@kagiyanagi";

export const KNOWN_TECH =
  `Astro,Tailwind CSS,JavaScript,Python,CSS,HTML,C,C++,Bash,VIM,React,Git,Photoshop,Figma,Pandas,NumPy,Hyprland,Davinci Resolve,Docker`.split(
    ",",
  );

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
export const GITHUB_USERNAME = "kagiyanagi";
export const GITHUB_REPO = `${GITHUB_USERNAME}/ren`;
export const NAV_LINKS: Array<{ title: string; href: string }> = [
  {
    title: "Telegram",
    href: "https://t.me/rensakashvani",
  },
  {
    title: "Github",
    href: "https://github.com/" + GITHUB_USERNAME,
  },
  {
    title: "YouTube",
    href: "https://youtube.com/@kagiyanagi",
  },
  {
    title: "Ko-fi",
    href: "https://ko-fi.com/kagiyanagi",
  },
  {
    title: "X",
    href: "https://x.com/kagiyanagi",
  },
];

// Hero subtitle rotation. The first line is what ships in the HTML.
export const TAGLINES = [
  'I go by "kagiyanagi"\non the internet.',
  "I build kernels\nfor fun.",
  "I use Arch,\nbtw.",
  "I should be\nstudying rn.",
  "I mustn't\nrun away.",
];

// Hover notes on the tech pills. Missing entries just don't get one.
export const TECH_NOTES: Record<string, string> = {
  Astro: "this site runs on it",
  "Tailwind CSS": "class soup, but tasty",
  JavaScript: "[] + {} === ?",
  Python: "import antigravity",
  CSS: "centering divs since forever",
  HTML: "yes it's a language. fight me",
  C: "segmentation fault (core dumped)",
  "C++": "template errors > my essays",
  Bash: "rm -rf ~/regrets",
  VIM: ":wq took me a week",
  React: "useEffect(() => cry(), [])",
  Git: "git push --force (sorry)",
  Photoshop: "ctrl+z ×400",
  Figma: "frames all the way down",
  Pandas: "not the animal",
  NumPy: "broadcasting, not podcasting",
  Hyprland: "my config is longer than this site",
  "Davinci Resolve": "render time: 3h 12m left",
  Docker: "works on my machine™",
};
