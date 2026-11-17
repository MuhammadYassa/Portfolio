// Local-only visual QA against an already running production preview.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  channel:
    process.env.PLAYWRIGHT_CHANNEL ||
    (process.platform === "win32" ? "chrome" : undefined),
});
try {
  await mkdir("test-results", { recursive: true });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: `test-results/showcase-${width}.png`,
      fullPage: true,
    });
    console.log(
      JSON.stringify({
        width,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        imageErrors: await page
          .locator("img")
          .evaluateAll((images) =>
            images
              .filter((image) => !image.complete || !image.naturalWidth)
              .map((image) => image.src),
          ),
      }),
    );
  }
} finally {
  await browser.close();
}
