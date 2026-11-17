// Share the actual portfolio hero. Keep this in sync after visual changes.
// Run npm run build and start npm run preview before this command.
import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  channel:
    process.env.PLAYWRIGHT_CHANNEL ||
    (process.platform === "win32" ? "chrome" : undefined),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/social-card.png" });
  await page.setViewportSize({ width: 192, height: 192 });
  await page.goto("http://127.0.0.1:4173/favicon.svg");
  await page.screenshot({ path: "public/favicon.png" });
} finally {
  await browser.close();
}
