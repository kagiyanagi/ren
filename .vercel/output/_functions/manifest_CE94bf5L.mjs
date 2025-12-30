import { d as decodeKey } from './chunks/astro/server_DS5lBA-s.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_xoJOioDY.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/aqua/Code/ren/","cacheDir":"file:///home/aqua/Code/ren/node_modules/.astro/","outDir":"file:///home/aqua/Code/ren/dist/","srcDir":"file:///home/aqua/Code/ren/src/","publicDir":"file:///home/aqua/Code/ren/public/","buildClientDir":"file:///home/aqua/Code/ren/dist/client/","buildServerDir":"file:///home/aqua/Code/ren/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/send-message","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/send-message\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"send-message","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/send-message.ts","pathname":"/api/send-message","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DIlqeVlW.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://aquakun.vercel.app/","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/aqua/Code/ren/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/home/aqua/Code/ren/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/send-message@_@ts":"pages/api/send-message.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","/home/aqua/Code/ren/node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CFsuQVFD.mjs","/home/aqua/Code/ren/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/home/aqua/Code/ren/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_C2BdgAqf.mjs","\u0000@astrojs-manifest":"manifest_CE94bf5L.mjs","/home/aqua/Code/ren/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BNPLji9g.js","/home/aqua/Code/ren/src/components/Contact.astro?astro&type=script&index=0&lang.ts":"_astro/Contact.astro_astro_type_script_index_0_lang.DBjpElr7.js","/home/aqua/Code/ren/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.CoMzivKC.js","/home/aqua/Code/ren/node_modules/.pnpm/astro@5.7.13_@types+node@22.15.19_jiti@1.21.7_rollup@4.41.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CtSceO8m.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/aqua/Code/ren/src/pages/index.astro?astro&type=script&index=0&lang.ts","const c=\"2025-12-30T04:27:20Z\",m=new Date(c).getTime();function d(){let t=Date.now()-m;const o=t%1e3;t=Math.floor(t/1e3);const e=t%60;t=Math.floor(t/60);const n=t%60;t=Math.floor(t/60);const s=t%24,a=Math.floor(t/24);document.getElementById(\"lastUpdated\").textContent=`Last updated: ${a}d ${s}h ${n}m ${e}s ${o}ms ago`}setInterval(d,16);"],["/home/aqua/Code/ren/src/components/Contact.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.querySelector(\"form\");s&&s.addEventListener(\"submit\",async a=>{a.preventDefault();const r=document.getElementById(\"name\")?.value||\"\",c=document.getElementById(\"email\")?.value||\"\",l=document.getElementById(\"message\")?.value||\"\";try{const e={name:r,email:c,message:l};console.log(\"[contact] Sending\",e);const t=await fetch(\"/api/send-message\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\",Accept:\"application/json\"},body:JSON.stringify(e)}),o=await t.text().catch(()=>\"\");let n;try{n=o?JSON.parse(o):null}catch(d){n={parseError:String(d),raw:o}}if(console.log(\"[contact] Response\",{status:t.status,ok:t.ok,body:n}),!t.ok){console.error(\"Send error\",n),alert(\"Failed to send message. Please try again.\");return}alert(\"Message sent successfully!\"),s.reset()}catch(e){console.error(\"Error sending message:\",e),alert(\"Failed to send message. Please try again.\")}})});"],["/home/aqua/Code/ren/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","window.addEventListener(\"scroll\",()=>{const e=document.getElementById(\"logo\");e&&(window.scrollY>100?e.className=\"pt-2 pb-1 !grid !place-items-center select-none leading-none hover:bg-white bg-black scale-100 hover:text-black text-white px-4 transition-all ease-in-out\":e.className=\"pt-2 pb-1 !grid !place-items-center select-none leading-none hover:bg-black bg-white scale-110 hover:text-white text-black px-4 transition-all ease-in-out\")});"]],"assets":["/_astro/villain.ClIbraFO.png","/_astro/hero.Bf9BmFl3.png","/_astro/index.DIlqeVlW.css","/image.jpg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CtSceO8m.js","/fonts/VCRosdNEUE.ttf"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"EXIC08o08cN78kbfEk/GfF1ZAM2kvxKTGN055oQxpvI="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
