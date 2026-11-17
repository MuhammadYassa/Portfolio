// Optional network check; deliberately separate from deterministic build/tests.
import { writeFile, mkdir } from "node:fs/promises";
import { profile, projects } from "../src/data/portfolio.js";
const urls = [...new Set([profile.github, profile.linkedin, ...projects.flatMap(project => [project.github, project.live]).filter(Boolean)])];
const results = await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: "follow" });
    await response.body?.cancel();
    return { url, status: response.status, finalUrl: response.url };
  } catch (error) { return { url, error: error.message }; }
}));
await mkdir("test-results", { recursive: true });
await writeFile("test-results/external-links.json", JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log(JSON.stringify(results, null, 2));
