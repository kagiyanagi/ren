/* empty css                                 */
import { e as createComponent, f as renderTemplate, k as renderComponent, n as maybeRenderHead, o as createAstro, p as addAttribute, s as spreadAttributes, q as renderSlot, t as renderScript, F as Fragment, v as renderHead } from '../chunks/astro/server_DS5lBA-s.mjs';
import '../chunks/index_DfOMS8cV.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_zZ4YnRIA.mjs';
import { a as SITE_TITLE, A as ABOUT_ME, N as NAV_LINKS, S as SITE_DESCRIPTION, K as KNOWN_TECH } from '../chunks/consts_DFLqPF7G.mjs';
export { renderers } from '../renderers.mjs';

const HeroImg = new Proxy({"src":"/_astro/hero.Bf9BmFl3.png","width":1080,"height":1080,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/aqua/Code/ren/src/hero.png";
							}
							
							return target[name];
						}
					});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<div class="hero-bg hidden md:block h-screen hero-bg-animate absolute top-0" data-astro-cid-bbe6dxrz></div> <section class="h-screen relative w-full grid grid-cols-1 grid-rows-0 md:grid-cols-2 gap-0 items-center" id="hero" data-astro-cid-bbe6dxrz> <div class="grid place-items-center" data-astro-cid-bbe6dxrz> <div class="text-center" data-astro-cid-bbe6dxrz> <h1 class="font-bold text-5xl sm:text-8xl" data-astro-cid-bbe6dxrz>', '</h1> <h2 class="text-xl sm:text-4xl opacity-95 inline" data-astro-cid-bbe6dxrz>\nEngineer, GFX designer\n<br data-astro-cid-bbe6dxrz>\nand a Student.\n<span class="blinking-cursor" data-astro-cid-bbe6dxrz>_</span> </h2> </div> </div> <div data-astro-cid-bbe6dxrz> ', ' </div> </section> <script>\n  // Your existing binary background animation\n  const hero_bg = document.querySelector(".hero-bg-animate");\n  setInterval(() => {\n    let binaryText = "";\n    for (let i = 0; i < 1000; i++) {\n      binaryText += Math.floor(Math.random() * 2).toString();\n    }\n    hero_bg.textContent = binaryText;\n  }, 300);\n<\/script> '])), maybeRenderHead(), `<${SITE_TITLE} />`, renderComponent($$result, "Image", $$Image, { "alt": "Hero", "src": HeroImg, "class": "brightness-200 scale-100 invert", "data-astro-cid-bbe6dxrz": true }));
}, "/home/aqua/Code/ren/src/components/Hero.astro", void 0);

const $$Astro$5 = createAstro("https://aquakun.vercel.app/");
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { title = "Title" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white flex items-center justify-center leading-none pt-2 pb-1 text-center select-none rounded-2xl px-5 font-semibold text-black w-fit"> <span>${title}</span> </div>`;
}, "/home/aqua/Code/ren/src/components/Breadcrumb.astro", void 0);

const $$Astro$4 = createAstro("https://aquakun.vercel.app/");
const $$Section = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Section;
  const { title = "Section", full_screen = false, className = "" } = Astro2.props;
  const passedClass = Astro2.props.class ?? className ?? "";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(title.toLowerCase().replaceAll(" ", ""), "id")}${addAttribute(`${full_screen ? "h-screen" : ""} px-4 py-10 w-screen !overflow-x-hidden ${className} ${passedClass}`, "class")}${spreadAttributes(Astro2.props)}> <div class="w-full grid place-items-center"> <h2 class="text-4xl md:text-6xl text-center">${`<${title} />`}</h2> </div> <div class="w-full mt-10 px-4"> ${renderSlot($$result, $$slots["default"])} </div> </section>`;
}, "/home/aqua/Code/ren/src/components/Section.astro", void 0);

const $$C2Fetch = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto bg-gradient-to-br relative pb-5 from-white/[0.001] to-white/[0.01] border-2 border-white rounded-lg overflow-hidden"> <div class="flex items-center justify-start px-4 py-2 bg-white/95"> <div class="flex space-x-2"> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> </div> </div> <div class="p-6 tracking-wider"> <a${addAttribute(`https://github.com/kagiyanagi/c2fetch`, "href")} class="block group"> <h2 class="text-xl font-medium text-white mb-2"> <span class="text-white/70 mr-2">❯</span>
C2Fetch
</h2> <p class="text-white font-medium tracking-widest text-sm mb-4">
[May 15, 2025]
</p> <p class="text-white/80 text-sm font-thin mb-4 line-clamp-1">
A sleek CPU temperature monitor based by psutil. 🌡️
</p> <p class="text-white absolute bottom-4 font-medium inline-flex items-center group-hover:underline-offset-4 underline-offset-8 underline transition-all ease-in-out">
Read more
<svg class="w-4 h-4 ml-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-jine-join="round"${addAttribute(2, "stroke-width")} d="M9 5l7 7-7 7"></path> </svg> </p> </a> </div> </div>`;
}, "/home/aqua/Code/ren/src/components/C2fetch.astro", void 0);

const $$TicTacToe = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto bg-gradient-to-br relative pb-5 from-white/[0.001] to-white/[0.01] border-2 border-white rounded-lg overflow-hidden"> <div class="flex items-center justify-start px-4 py-2 bg-white/95"> <div class="flex space-x-2"> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> </div> </div> <div class="p-6 tracking-wider"> <a${addAttribute(`https://github.com/isaacaman/TicTacToe`, "href")} class="block group"> <h2 class="text-xl font-medium text-white mb-2"> <span class="text-white/70 mr-2">❯</span>
TicTacToe
</h2> <p class="text-white font-medium tracking-widest text-sm mb-4">
[May 14, 2024]
</p> <p class="text-white/80 text-sm font-thin mb-4 line-clamp-1">
My First Cpp Game Tic Tac Toe.
</p> <p class="text-white absolute bottom-4 font-medium inline-flex items-center group-hover:underline-offset-4 underline-offset-8 underline transition-all ease-in-out">
Read more
<svg class="w-4 h-4 ml-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(2, "stroke-width")} d="M9 5l7 7-7 7"></path> </svg> </p> </a> </div> </div>`;
}, "/home/aqua/Code/ren/src/components/TicTacToe.astro", void 0);

const $$Aquamarinekernel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto bg-gradient-to-br relative pb-5 from-white/[0.001] to-white/[0.01] border-2 border-white rounded-lg overflow-hidden"> <div class="flex items-center justify-start px-4 py-2 bg-white/95"> <div class="flex space-x-2"> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> </div> </div> <div class="p-6 tracking-wider"> <a${addAttribute(`https://github.com/kagiyanagi/android_kernel_xiaomi_gale`, "href")} class="block group"> <h2 class="text-xl font-medium text-white mb-2"> <span class="text-white/70 mr-2">❯</span>
Aquamarine kernel.
</h2> <p class="text-white font-medium tracking-widest text-sm mb-4">
[Jul 22, 2025]
</p> <p class="text-white/80 text-sm font-thin mb-4 line-clamp-1">
"Overclocked custom kernel for Poco C65/Redmi 13C(Gale/Gust)"
</p> <p class="text-white absolute bottom-4 font-medium inline-flex items-center group-hover:underline-offset-4 underline-offset-8 underline transition-all ease-in-out">
Read more
<svg class="w-4 h-4 ml-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(2, "stroke-width")} d="M9 5l7 7-7 7"></path> </svg> </p> </a> </div> </div>`;
}, "/home/aqua/Code/ren/src/components/Aquamarinekernel.astro", void 0);

const $$Todohcj = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto bg-gradient-to-br relative pb-5 from-white/[0.001] to-white/[0.01] border-2 border-white rounded-lg overflow-hidden"> <div class="flex items-center justify-start px-4 py-2 bg-white/95"> <div class="flex space-x-2"> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> </div> </div> <div class="p-6 tracking-wider"> <a${addAttribute(`https://github.com/isaacaman/todo-hcj`, "href")} class="block group"> <h2 class="text-xl font-medium text-white mb-2"> <span class="text-white/70 mr-2">❯</span>
ToDo in HCJ
</h2> <p class="text-white font-medium tracking-widest text-sm mb-4">
[Aug 4, 2023]
</p> <p class="text-white/80 text-sm font-thin mb-4 line-clamp-1">
A real useable ToDo application in plane HTML CSS and javaScript
</p> <p class="text-white absolute bottom-4 font-medium inline-flex items-center group-hover:underline-offset-4 underline-offset-8 underline transition-all ease-in-out">
Read more
<svg class="w-4 h-4 ml-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(2, "stroke-width")} d="M9 5l7 7-7 7"></path> </svg> </p> </a> </div> </div>`;
}, "/home/aqua/Code/ren/src/components/Todohcj.astro", void 0);

const $$Astro$3 = createAstro("https://aquakun.vercel.app/");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/home/aqua/Code/ren/node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/aqua/Code/ren/node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro$2 = createAstro("https://aquakun.vercel.app/");
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const {
    title = SITE_TITLE,
    description = ABOUT_ME,
    image = "/image.jpg"
  } = Astro2.props;
  return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/png" href="/muichiro.ico"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="sitemap" href="/sitemap-index.xml"><!-- Font preloads --><link rel="preload" href="/fonts/VCRosdNEUE.ttf" as="font" type="font/ttf" crossorigin><!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.url), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.url), "content")}><!-- View Transitions  -->${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}`;
}, "/home/aqua/Code/ren/src/components/BaseHead.astro", void 0);

const $$Astro$1 = createAstro("https://aquakun.vercel.app/");
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  return renderTemplate`${maybeRenderHead()}<nav class="w-full !z-[9999] py-5 px-4 bg-black/90 backdrop-blur-sm"> <div class="w-full grid gap-4 place-items-center grid-cols-1 md:flex md:justify-between md:px-4"> <a href="/"> <div id="logo" class="pt-2 pb-1 !grid !place-items-center select-none leading-none hover:bg-black bg-white scale-110 hover:text-white text-black px-4 transition-all ease-in-out">
^#^
</div> </a> <div class="flex flex-wrap gap-4 md:pr-5 justify-center"> <div class="hidden md:block">/</div> ${NAV_LINKS.map((link) => {
    const href = link.href ?? link.title.toLowerCase().replaceAll(" ", "-");
    const pathname = Astro2.url.pathname.replace(
      "/",
      ""
    );
    const subpath = pathname.match(/[^\/]+/g);
    const isActive = href === pathname || href === "/" + (subpath?.[0] || "");
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a${addAttribute(["hover:bg-white hover:text-black transition-all ease-in-out px-2 max-w-fit", [{ "bg-white text-black": isActive }]], "class:list")}${addAttribute(`/${href}`, "href")}> <div>${link.title}</div> </a> <div class="hidden md:block">/</div> ` })}`;
  })} </div> </div> </nav> ${renderScript($$result, "/home/aqua/Code/ren/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/aqua/Code/ren/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const today = /* @__PURE__ */ new Date();
  return renderTemplate`${maybeRenderHead()}<section id="footer" class="grid relative place-items-center text-center py-0 bg-white/[0.001]"> <div class="h-40 overflow-hidden absolute"> <div class="hero-bg">
1000001100000000101001011011110000000101000011000100111110110100101101101101011000111110111010010000010010101100011001111110010110011010000011001110001100111010010010010011000001001100001111100010100101001010101000000011101000010000000000011101101001010100110111110100001100010100001100010100010110001110001011000001011110010100101011101100001010011100100010000001010000100011111011010110000001010010100000110011000010100001110111101010110010111100111100011001000011011001110000000000101110110001101111101110011011100010111011010001000100101101101100110111010011010110010000101010010000100100110101101110101011011001000111100111001011101000101101001001001011011000011111001001100101110100000111000100010010100001111101100001001110011011111001111101001110000000010000100101101101011011111000011100000010110111001110000110110100110100110011101100000101011101001010111001000000101000010111110101100110000110110001101000101100001110000110110011001010001011011000110100000101111101000011110110100010011110
</div> </div> <p class="mb-10 py-3 px-2 mx-auto max-w-72 sm:max-w-full text-center">
&copy; ${today.getFullYear()} ${SITE_TITLE}. All rights reserved. Designed and Crafted with ❤️ & ✨ by ~
    @isaacaman
</p> </section>`;
}, "/home/aqua/Code/ren/src/components/Footer.astro", void 0);

const $$Astro = createAstro("https://aquakun.vercel.app/");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = SITE_TITLE, description = SITE_DESCRIPTION } = Astro2.props;
  return renderTemplate`<html lang="en" class="!overflow-x-hidden"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description })}${renderHead()}</head> <body class="bg-black text-white tracking-wide !overflow-x-hidden"> <header class="fixed top-0 w-screen z-[9999]">${renderComponent($$result, "Navbar", $$Navbar, {})}</header> <main class="pt-28 md:pt-20">${renderSlot($$result, $$slots["default"])}</main> <footer class="w-screen bottom-0 overflow-x-hidden">${renderComponent($$result, "Footer", $$Footer, {})}</footer> </body></html>`;
}, "/home/aqua/Code/ren/src/layouts/Layout.astro", void 0);

const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto bg-gradient-to-br relative pb-5 from-white/[0.001] to-white/[0.01] rounded-lg overflow-hidden"> <div class="flex items-center justify-start px-4 py-2 bg-white/95"> <div class="flex space-x-2"> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> <div class="w-3 h-3 rounded-full bg-black"></div> </div> </div> <div class="p-6 tracking-wider"> <h2 class="text-xl font-medium text-white mb-4"> <span class="text-white/70 mr-2">❯</span>
Get in touch
</h2> <p class="text-white/80 text-sm font-thin mb-6">
Have a question or want to collaborate? Send me a message on Telegram!
</p> <form class="flex flex-col gap-4" novalidate> <div class="flex flex-col gap-2"> <label for="name" class="text-white/70 text-sm">Name</label> <input type="text" id="name" name="name" placeholder="Your name" required class="bg-white/5 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none transition-colors"> </div> <div class="flex flex-col gap-2"> <label for="email" class="text-white/70 text-sm">Email</label> <input type="email" id="email" name="email" placeholder="your@email.com" required class="bg-white/5 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none transition-colors"> </div> <div class="flex flex-col gap-2"> <label for="message" class="text-white/70 text-sm">Message</label> <textarea id="message" name="message" placeholder="Your message..." rows="5" required class="bg-white/5 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none transition-colors resize-none"></textarea> </div> <button type="submit" class="bg-white/10 text-white font-medium py-2 px-4 rounded hover:bg-white/20 transition-all ease-in-out">
Send Message
</button> </form> ${renderScript($$result, "/home/aqua/Code/ren/src/components/Contact.astro?astro&type=script&index=0&lang.ts")} </div> </div>`;
}, "/home/aqua/Code/ren/src/components/Contact.astro", void 0);

const VillainImg = new Proxy({"src":"/_astro/villain.ClIbraFO.png","width":1080,"height":1080,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/aqua/Code/ren/src/villain.png";
							}
							
							return target[name];
						}
					});

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Aman - Engineer, GFX designer and High school student" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "Section", $$Section, { "title": "About Me", "class": "relative w-full" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center min-h-[calc(160vh)] md:min-h-[calc(70vh)] sm:min-h-[calc(70vh)]">  <div class="w-full flex justify-center"> ${renderComponent($$result3, "Image", $$Image, { "alt": "Profile illustration", "src": VillainImg, "class": "brightness-200 max-w-xs sm:max-w-sm md:max-w-md object-contain invert" })} </div>  <div class="w-full flex flex-col justify-center text-lg sm:text-xl gap-4 max-w-screen-lg"> <h3 class="text-2xl sm:text-4xl opacity-95 mb-4 flex items-center gap-4 flex-col sm:flex-row">
Hi, I'm Aman <span class="text-xl text-[#CCCCCC]">(A.K.A kagiyanagi/ren/aqua).</span> </h3> <p class="opacity-95">
I'm a self-taught engineer and passionate tech guy from India,
          currently in high school. My interests span a wide range in Computer
          Science, including:
</p> <p class="opacity-95">
Web development, IoT, Machine learning, Linux(Arch btw). I'm a big fan
          of anime (MAL link in navbar) and music, which both inspire my
          creativity. Core Android development: I love building custom ROMs and
          kernels. I've archived everything on my
<a class="text-teal-400 hover:text-teal-500 underline transition-all" href="https://t.me/rensakashvani">Telegram channel</a> </p> <p class="opacity-95">
Right now I'm mostly focused on high school (you know how it is), but
          I'm still highly motivated and committed to continuous learning and
          growth in the tech world.
</p> <p id="lastUpdated" class="text-zinc-600 text-xl">Last updated: loading…</p> ${renderScript($$result3, "/home/aqua/Code/ren/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </div> </div> ` })} ${renderComponent($$result2, "Section", $$Section, { "title": "Technologies i \u2665\uFE0E", "full_screen": false }, { "default": ($$result3) => renderTemplate` <div class="w-full grid place-items-center mb-12"> <div class="w-full gap-4 flex flex-wrap max-w-2xl text-lg justify-center"> ${KNOWN_TECH.map((x) => renderTemplate`${renderComponent($$result3, "Breadcrumb", $$Breadcrumb, { "title": x })}`)} </div> </div> ` })} ${renderComponent($$result2, "Section", $$Section, { "title": "My projects", "className": "bg-gradient-to-b from-black/70 from-[5%] to-black via-black max-w-screen-2xl mx-auto items-center mb-12" }, { "default": ($$result3) => renderTemplate` <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"> ${renderComponent($$result3, "C2fetch", $$C2Fetch, {})} ${renderComponent($$result3, "Aquamarinekernel", $$Aquamarinekernel, {})} ${renderComponent($$result3, "Todohcj", $$Todohcj, {})} ${renderComponent($$result3, "TicTacToe", $$TicTacToe, {})} </div> ` })} ${renderComponent($$result2, "Section", $$Section, { "title": "Contact", "className": "max-w-screen-2xl mx-auto items-center mb-12" }, { "default": ($$result3) => renderTemplate` <div class="w-full grid place-items-center"> <div class="w-full max-w-xl"> ${renderComponent($$result3, "Contact", $$Contact, {})} </div> </div> ` })} ` })}`;
}, "/home/aqua/Code/ren/src/pages/index.astro", void 0);

const $$file = "/home/aqua/Code/ren/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
