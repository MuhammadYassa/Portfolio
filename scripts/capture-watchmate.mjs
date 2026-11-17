// Capture only the public application. No authentication or fabricated UI.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.launch({
  channel:
    process.env.PLAYWRIGHT_CHANNEL ||
    (process.platform === "win32" ? "chrome" : undefined),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const response = await page.goto("https://mywatchmate.us", {
    waitUntil: "networkidle",
    timeout: 45000,
  });
  if (!response.ok())
    throw new Error(`WatchMate returned ${response.status()}`);
  await page.locator("h1").first().waitFor();
  await page.evaluate(() =>
    Promise.race([
      new Promise((resolve) => setTimeout(resolve, 5000)),
      Promise.all(
        [...document.images]
          .filter(
            (image) =>
              image.getBoundingClientRect().width > 0 &&
              image.getBoundingClientRect().height > 0 &&
              image.getBoundingClientRect().top < innerHeight &&
              image.getBoundingClientRect().right > 0 &&
              image.getBoundingClientRect().left < innerWidth,
          )
          .map((image) => image.decode().catch(() => {})),
      ),
    ]),
  );
  await mkdir("public/projects", { recursive: true });
  await page.screenshot({
    path: "public/projects/watchmate-desktop.jpg",
    type: "jpeg",
    quality: 82,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() =>
    Promise.race([
      new Promise((resolve) => setTimeout(resolve, 5000)),
      Promise.all(
        [...document.images]
          .filter(
            (image) =>
              image.getBoundingClientRect().width > 0 &&
              image.getBoundingClientRect().height > 0 &&
              image.getBoundingClientRect().top < innerHeight &&
              image.getBoundingClientRect().right > 0 &&
              image.getBoundingClientRect().left < innerWidth,
          )
          .map((image) => image.decode().catch(() => {})),
      ),
    ]),
  );
  await page.screenshot({
    path: "public/projects/watchmate-mobile.jpg",
    type: "jpeg",
    quality: 82,
  });
  await writeFile(
    "public/projects/README.md",
    `# WatchMate screenshots\n\nCaptured directly from ${page.url()} on ${new Date().toISOString().slice(0, 10)}.\n\nDesktop: 1440 × 900. Mobile: 390 × 844. These are unedited public home-page captures, not tracking-dashboard demonstrations. No login was used and no product UI or user activity was fabricated. Movie artwork is part of the application capture.\n\nRefresh with: node scripts/capture-watchmate.mjs (uses installed Chrome on Windows). Keep the captured dimensions and accessibility text in src/data/projectMedia.js in sync.\n`,
  );
  console.log(
    "Captured authentic WatchMate public desktop and mobile screenshots.",
  );
} finally {
  await browser.close();
}
