export const SITE_TITLE = "Aman";
export const SITE_DESCRIPTION =
  `A personal portfolio built with Astro and Tailwind CSS — take a look!`.trim();

export const KNOWN_TECH =
  `Astro,Tailwind CSS,JavaScript,Python,CSS,HTML,C,C++,Bash,VIM,React,Git,Photoshop,Figma,Pandas,NumPy,Hyprland, Davinci Resolve, Docker`.split(
    ",",
  );

export const PROJECTS = [
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
] as const;
export const ABOUT_ME =
  `I'm a self-taught engineer from India, currently in high school. My interests cover web development, Android (core), low-level systems, graphic design, IoT, and machine learning. I also enjoy anime and music, which inspire my creative work — I'm committed to continuous learning and building projects that matter.`.trim();
export const GITHUB_USERNAME = "kagiyanagi";
export const QUOTE = "Engineer, GFX designer";
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
    title: "MyAnimeList",
    href: "//myanimelist.net/profile/kagiyanagi",
  },
  {
    title: "X",
    href: "//x.com/kagiyanagi",
  },
];
