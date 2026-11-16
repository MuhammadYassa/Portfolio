import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { build } from "vite";

process.env.NODE_ENV = "production";
const { renderToString } = await import("react-dom/server");
const { createElement } = await import("react");

// A static page needs no server at runtime. Render the same App at build time so
// recruiters and crawlers can read it even before JavaScript has loaded.
const output = resolve("node_modules/.cache/portfolio-ssr");
await build({
  build: {
    ssr: "src/App.jsx",
    outDir: output,
    emptyOutDir: true,
    manifest: false,
  },
  publicDir: false,
});
const { default: App } = await import(
  pathToFileURL(resolve(output, "App.js")).href
);
const html = await readFile("dist/index.html", "utf8");
await writeFile(
  "dist/index.html",
  html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderToString(createElement(App))}</div>`,
  ),
);
await rm(output, { recursive: true, force: true });
console.log("Prerendered portfolio content into dist/index.html.");
