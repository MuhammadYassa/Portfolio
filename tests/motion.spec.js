import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

for (const width of [1440, 390]) {
  test(`motion and layout stability at ${width}px`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
      reducedMotion: "no-preference",
      isMobile: width === 390,
      hasTouch: width === 390,
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
    try {
      await page.goto("http://127.0.0.1:4173/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      // Hold long enough for the short entrance to be visible in the recording.
      await page.waitForTimeout(850);
      await page.evaluate(() => {
        window.motionMetrics.interactionStartedAt = performance.now();
      });
      if (width === 1440) {
        const before = await page
          .locator(".hero-showcase")
          .evaluate((el) => getComputedStyle(el).transform);
        const panel = await page.locator(".hero-showcase").boundingBox();
        await page.mouse.move(
          panel.x + panel.width * 0.8,
          panel.y + panel.height * 0.3,
          { steps: 12 },
        );
        await expect
          .poll(() =>
            page
              .locator(".hero-showcase")
              .evaluate((el) => getComputedStyle(el).transform),
          )
          .not.toBe(before);
        await page.getByRole("link", { name: "View Projects" }).hover();
      } else {
        await page.getByRole("button", { name: "Menu +" }).tap();
        await page.waitForTimeout(300);
        await expect(
          page.getByRole("link", { name: "Projects", exact: true }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Close" }).tap();
        await page.locator(".hero-showcase").scrollIntoViewIfNeeded();
        await page.waitForTimeout(450);
      }
      if (width === 390)
        await page.getByRole("link", { name: "View Projects" }).tap();
      else await page.getByRole("link", { name: "View Projects" }).click();
      const traceButton = page.getByRole("button", {
        name: "Trace cached request",
      });
      await traceButton.scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      const heightBefore = (await page.locator("#watchmate").boundingBox())
        .height;
      if (width === 390) await traceButton.tap();
      else await traceButton.click();
      await expect(page.locator(".diagram-description")).toContainText(
        "React → API → Redis → API → React",
      );
      expect(
        await page
          .locator(".trace-run")
          .evaluate((el) => el.getAnimations({ subtree: true }).length),
      ).toBeGreaterThan(0);
      // Only Redis participates in this example cache hit, not the import/database branches.
      expect(
        await page
          .locator(".diagram-branches > span:not(.trace-cache)")
          .evaluateAll(
            (nodes) =>
              nodes.flatMap((node) => node.getAnimations({ subtree: true }))
                .length,
          ),
      ).toBe(0);
      await page.waitForTimeout(1550);
      expect(
        (await page.locator("#watchmate").boundingBox()).height,
      ).toBeCloseTo(heightBefore, 0);
      expect(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => animation.playState === "running").length,
        ),
      ).toBe(0);
      await page.locator("#housing").scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      const pipeline = page.locator(".housing-graphic");
      const pipelineHeight = (await pipeline.boundingBox()).height;
      if (width === 390)
        await page.getByRole("button", { name: "Merge", exact: true }).tap();
      else {
        await page.getByRole("button", { name: "Merge", exact: true }).focus();
        await page.keyboard.press("Enter");
      }
      await expect(page.locator(".stage-description")).toContainText(
        "transactionally",
      );
      expect((await pipeline.boundingBox()).height).toBeCloseTo(
        pipelineHeight,
        0,
      );
      await page.waitForTimeout(450);
      await page.locator("#about").scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      const metrics = await page.evaluate(() => ({
        ...window.motionMetrics,
        interactionLongTasks: window.motionMetrics.longTasks.filter(
          (task) => task.startTime >= window.motionMetrics.interactionStartedAt,
        ),
      }));
      await writeFile(
        resolve(`test-results/motion-metrics-${width}.json`),
        JSON.stringify(metrics, null, 2),
      );
      expect(metrics.layoutShift).toBeLessThan(0.01);
      expect(errors).toEqual([]);
      await testInfo.attach("motion-metrics", {
        body: JSON.stringify(metrics, null, 2),
        contentType: "application/json",
      });
    } finally {
      const video = page.video();
      await context.close();
      const path = resolve(`test-results/motion-${width}.webm`);
      await video.saveAs(path);
      await testInfo.attach("animation-preview", {
        path,
        contentType: "video/webm",
      });
    }
  });
}
