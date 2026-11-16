import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { profile } from "../src/data/portfolio.js";

const html = await readFile("dist/index.html", "utf8");
assert(html.includes('http-equiv="Content-Security-Policy"'), "Production CSP is required");
assert.equal(
  (html.match(/<h1[ >]/g) || []).length,
  1,
  "Exactly one primary heading is required",
);
assert(
  html.includes("856,614") && html.includes("DNR Events LLC"),
  "Prerender must contain portfolio content",
);
assert(
  !html.includes("/src/main.jsx"),
  "Production HTML must use bundled assets",
);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g))
  assert(ids.includes(anchor), `Missing anchor #${anchor}`);
for (const [, asset] of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)"/g)) {
  await access(`dist${asset}`);
}
assert.equal(
  (await readFile("dist/CNAME", "utf8")).trim(),
  "www.muhammadyassa.com",
);
for (const asset of [
  "robots.txt",
  "sitemap.xml",
  "social-card.png",
  "favicon.svg",
])
  await access(`dist/${asset}`);
if (profile.resume) {
  assert.equal(
    profile.resume,
    "/resume.pdf",
    "Use the stable public resume filename",
  );
  assert(
    (await readFile("dist/resume.pdf"))
      .subarray(0, 5)
      .equals(Buffer.from("%PDF-")),
    "Resume must be an actual PDF",
  );
} else console.log("Resume PDF unavailable: the CTA offers an email request.");
assert(
  !/formsubmit|cdnjs|fonts.googleapis|dangerouslySetInnerHTML/.test(html),
  "Unexpected third-party integration",
);
console.log(
  "Build checks passed: prerender, anchors, local assets, metadata assets, CNAME, and resume behavior.",
);
