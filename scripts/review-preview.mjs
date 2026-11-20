import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: process.platform === "win32" ? "chrome" : undefined,
});
try {
  const review = [];
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `test-results/review-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    // Section captures support visual review at readable scale, without the
    // sticky header being composited over a stitched element screenshot.
    for (const id of ["city", "watchmate", "housing", "renter", "experience", "aboutme", "contact"]) {
      const section = page.locator(`#${id}`);
      const originalViewport = page.viewportSize();
      const bounds = await section.boundingBox();
      // Give Chrome room to paint the complete element, including tall
      // mobile articles, instead of capturing unpainted viewport tiles.
      await page.setViewportSize({ width, height: Math.max(originalViewport.height, Math.ceil(bounds.height) + 200) });
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await section.screenshot({
        path: `test-results/review-${id}-${width}.png`,
        style: ".site-header, .skip-link { visibility: hidden !important; }",
      });
      await page.setViewportSize(originalViewport);
    }
    const pipeline = [];
    for (const name of ["Discover", "Validate", "Merge"]) {
      await page.getByRole("button", { name: new RegExp(name) }).click();
      pipeline.push(await page.locator(".pipeline-visual").evaluate((panel) => ({
        stage: panel.querySelector('[aria-pressed="true"]').textContent.trim(),
        textFits: panel.querySelector("#pipeline-detail > div").getBoundingClientRect().bottom <= panel.querySelector(".pipeline-proof").getBoundingClientRect().top,
      })));
    }
    const result = {
        width,
        errors,
        pipeline,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
    };
    review.push(result);
    console.log(JSON.stringify(result));
    if (result.overflow || errors.length || pipeline.some(stage => !stage.textFits))
      throw new Error(`Visual review found overflow, browser errors or clipped pipeline details at ${width}px`);
    await page.close();
  }
  await writeFile("test-results/visual-review.json", JSON.stringify(review, null, 2));
} finally {
  await browser.close();
}
