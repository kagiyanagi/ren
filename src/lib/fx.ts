// Tiny shared toolbox for the client-side effects. The shader (CRT.astro)
// listens for "fx" events; everything else just calls these helpers.

export type Mode = "matrix" | "alert" | "sleep";
export type FxDetail =
  | { kind: "glitch" }
  | { kind: "mode"; mode: Mode; on: boolean };
type ToastType = "success" | "error" | "warning" | "info";

declare global {
  interface Window {
    showNotification?: (
      message: string,
      type?: ToastType,
      ttl?: number,
    ) => void;
  }
  interface WindowEventMap {
    fx: CustomEvent<FxDetail>;
  }
}

export const fx = (detail: FxDetail) =>
  dispatchEvent(new CustomEvent("fx", { detail }));

export const calm = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export const toast = (msg: string, type: ToastType = "info", ttl?: number) =>
  window.showNotification?.(msg, type, ttl);

export const pick = <T>(xs: readonly T[]): T =>
  xs[Math.floor(Math.random() * xs.length)];

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// True when the user is typing somewhere and shortcuts should stay quiet.
export const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement &&
  (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

const NOISE = "!<>-_\\/[]{}=+*^?#01";
const running = new WeakMap<HTMLElement, number>();

/** Decode-style text swap: chars flicker through noise, then settle. */
export function scramble(el: HTMLElement, to: string, ms = 700) {
  if (calm()) {
    el.textContent = to;
    return Promise.resolve();
  }
  const id = (running.get(el) ?? 0) + 1;
  running.set(el, id);
  const from = el.textContent ?? "";
  const chars = Array.from(
    { length: Math.max(from.length, to.length) },
    (_, i) => ({
      from: from[i] ?? "",
      to: to[i] ?? "",
      start: Math.random() * ms * 0.4,
      end: ms * 0.4 + Math.random() * ms * 0.6,
    }),
  );
  const t0 = performance.now();
  return new Promise<void>((done) => {
    const step = (now: number) => {
      if (running.get(el) !== id) return done();
      const t = now - t0;
      let out = "";
      let left = 0;
      for (const c of chars) {
        if (t >= c.end) out += c.to;
        else {
          left++;
          out += t < c.start || /\s/.test(c.to) ? c.from : pick([...NOISE]);
        }
      }
      el.textContent = out;
      if (left) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  });
}

// --- page-wide tricks, shared by the terminal and the typed-word easter eggs

const root = document.documentElement;
export const PHOSPHORS = ["white", "green", "amber"] as const;

export function setPhosphor(name: string, save = true) {
  if (name === "white") delete root.dataset.phosphor;
  else root.dataset.phosphor = name;
  if (!save) return;
  try {
    if (name === "white") localStorage.removeItem("phosphor");
    else localStorage.setItem("phosphor", name);
  } catch {}
}

const saved = () => root.dataset.phosphor ?? "white";

function flash(cls: string, ms: number) {
  root.classList.remove(cls);
  void root.offsetWidth; // restart the animation if it's already running
  root.classList.add(cls);
  setTimeout(() => root.classList.remove(cls), ms);
}

export function degauss() {
  fx({ kind: "glitch" });
  flash("degauss", 1000);
}

let matrixTimer = 0;
export function matrix(ms = 12_000) {
  const before = matrixTimer ? "white" : saved();
  clearTimeout(matrixTimer);
  setPhosphor("green", false);
  fx({ kind: "mode", mode: "matrix", on: true });
  matrixTimer = window.setTimeout(() => {
    matrixTimer = 0;
    fx({ kind: "mode", mode: "matrix", on: false });
    setPhosphor(before, false);
  }, ms);
}

let alerting = false;
export async function angel() {
  if (alerting) return;
  alerting = true;
  const before = saved();
  const banner = document.createElement("div");
  banner.className = "angel-alert";
  banner.setAttribute("role", "alert");
  banner.innerHTML =
    '<div class="angel-stripes"></div><p>EMERGENCY</p><strong>PATTERN BLUE</strong><span>ANGEL DETECTED IN SECTOR 3</span><div class="angel-stripes"></div>';
  document.body.append(banner);
  new Audio("/terminal_bell.mp3").play().catch(() => {});
  setPhosphor("red", false);
  fx({ kind: "mode", mode: "alert", on: true });
  degauss();
  await sleep(5200);
  banner.classList.add("out");
  fx({ kind: "mode", mode: "alert", on: false });
  setPhosphor(before, false);
  await sleep(500);
  banner.remove();
  alerting = false;
  toast("False alarm. It was just you.", "success");
}

export async function nuke() {
  if (root.classList.contains("nuked")) return;
  document.querySelectorAll<HTMLElement>("main > *, footer").forEach((el) => {
    el.style.setProperty("--fall-delay", `${Math.random() * 400}ms`);
    el.style.setProperty("--fall-spin", `${(Math.random() - 0.5) * 30}deg`);
  });
  fx({ kind: "glitch" });
  root.classList.add("nuked");
  await sleep(2600);
  root.classList.remove("nuked");
  degauss();
  toast("Restored from backup. Please don't do that again.", "success", 5000);
}

const TRAIN = String.raw`
      ====        ________                ___________
  _D _|  |_______/        \__I_I_____===__|_________|
   |(_)---  |   H\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\  /~~\  /~~\  /~~\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\___/
  \_/      \O=====O=====O=====O_/      \_/`;

export function sl() {
  const el = document.createElement("pre");
  el.className = "sl-train";
  el.setAttribute("aria-hidden", "true");
  el.textContent = TRAIN;
  document.body.append(el);
  setTimeout(() => el.remove(), 5200);
}
