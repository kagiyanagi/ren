const SITE_TITLE = "Aman";
const SITE_DESCRIPTION = `A personal portfolio built with Astro and Tailwind CSS — take a look!`.trim();
const KNOWN_TECH = `Astro,Tailwind CSS,JavaScript,Python,CSS,HTML,C,C++,Bash,VIM,React,Git,Photoshop,Figma,Pandas,NumPy,Hyprland, Davinci Resolve, Docker`.split(
  ","
);
const ABOUT_ME = `I'm a self-taught engineer from India, currently in high school. My interests cover web development, Android (core), low-level systems, graphic design, IoT, and machine learning. I also enjoy anime and music, which inspire my creative work — I'm committed to continuous learning and building projects that matter.`.trim();
const GITHUB_USERNAME = "kagiyanagi";
const NAV_LINKS = [
  {
    title: "Telegram",
    href: "//t.me/kagiyanagi"
  },
  {
    title: "Github",
    href: "//github.com/" + GITHUB_USERNAME
  },
  {
    title: "YouTube",
    href: "//youtube.com/@kagiyanagi"
  },
  {
    title: "MyAnimeList",
    href: "//myanimelist.net/profile/kagiyanagi"
  },
  {
    title: "X",
    href: "//x.com/kagiyanagi"
  }
];

export { ABOUT_ME as A, KNOWN_TECH as K, NAV_LINKS as N, SITE_DESCRIPTION as S, SITE_TITLE as a };
