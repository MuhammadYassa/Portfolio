import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
for (const width of [1440, 390]) {
  test(`motion, pointer or touch interactions and layout stability at ${width}px`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
      isMobile: width === 390,
      hasTouch: width === 390,
      reducedMotion: "no-preference",
      recordVideo: {
        dir: testInfo.outputPath("recording"),
        size: { width, height: width === 1440 ? 1000 : 844 },
      },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.motionMetrics = { layoutShift: 0, longTasks: [] };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput)
            window.motionMetrics.layoutShift += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.motionMetrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
          });
      }).observe({ type: "longtask", buffered: true });
    });
    const activate = async (locator) =>
      width === 390 ? locator.tap() : locator.click();
    try {
      await page.goto("http://127.0.0.1:4173/");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(900);
      if (width === 390) {
        await activate(page.getByRole("button", { name: "Open navigation" }));
        await page.waitForTimeout(250);
        await activate(
          page
            .getByRole("navigation", { name: "Mobile navigation" })
            .getByRole("link", { name: "Projects", exact: true }),
        );
      } else {
        const cta = page.getByRole("link", { name: "View projects" });
        await cta.hover();
        await expect(cta).toHaveCSS("background-color", "rgb(243, 238, 229)");
        await cta.click();
      }
      await page.locator(".screenshot-showcase").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      const stage = page.locator(".screenshot-stage");
      const originalHeight = (await stage.boundingBox()).height;
      await activate(page.getByRole("button", { name: "Mobile", exact: true }));
      await page.waitForTimeout(350);
      expect((await stage.boundingBox()).height).toBeCloseTo(originalHeight, 2);
      await activate(
        page.getByRole("button", {
          name: "Enlarge WatchMate mobile screenshot",
        }),
      );
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.waitForTimeout(500);
      await activate(page.getByRole("button", { name: "Close screenshot" }));
      await activate(
        page.getByRole("button", { name: "Desktop", exact: true }),
      );
      await page.locator(".pipeline-visual").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      for (const name of ["Validate", "Merge"]) {
        await activate(page.getByRole("button", { name: new RegExp(name) }));
        await page.waitForTimeout(450);
      }
      await page.locator("#aboutme").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      expect(errors).toEqual([]);
      const metrics = await page.evaluate(() => window.motionMetrics);
      await writeFile(
        resolve(`test-results/motion-metrics-${width}.json`),
        JSON.stringify(metrics, null, 2),
      );
      expect(metrics.layoutShift).toBeLessThan(0.02);
    } finally {
      const video = page.video();
      await context.close();
      await video.saveAs(resolve(`test-results/motion-${width}.webm`));
    }
  });
}
