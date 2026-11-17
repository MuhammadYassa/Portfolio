import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: process.platform === "win32" ? "chrome" : undefined,
});
try {
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
    console.log(
      JSON.stringify({
        width,
        errors,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      }),
    );
    await page.close();
  }
} finally {
  await browser.close();
}
