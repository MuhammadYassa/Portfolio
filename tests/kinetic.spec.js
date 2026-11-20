import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";

// Video is the interaction artifact. Avoid a second full-page screencast in traces.
test.use({ trace: "off" });
test.setTimeout(120_000);

const settled = async page => {
  await expect(page.locator(".kinetic-stage")).not.toHaveAttribute("data-moving", "true", { timeout: 7000 });
};
const sample = page => page.locator(".kinetic-letter").evaluateAll(nodes => nodes.map(node => {
  const m = new DOMMatrixReadOnly(getComputedStyle(node).transform);
  return { x: m.m41, y: m.m42, rotation: Math.atan2(m.b, m.a) };
}));

for (const width of [1440, 390]) {
  test(`kinetic: entrance, ${width === 390 ? "real touch" : "pointer"}, drag, wave, cancellation and video at ${width}px`, async ({ browser }, testInfo) => {
    const height = width === 390 ? 844 : 1100;
    const context = await browser.newContext({
      viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390,
      reducedMotion: "no-preference",
      recordVideo: { dir: testInfo.outputPath("video"), size: { width: Math.min(width, 1280), height: Math.min(height, 978) } },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(() => {
      window.kineticMetrics = { layoutShift: 0, longTasks: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.kineticMetrics.layoutShift += e.value; }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.kineticMetrics.longTasks.push(e.duration); }).observe({ type: "longtask", buffered: true });
    });
    try {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const stage = page.locator(".kinetic-stage");
      await expect(stage).toHaveAttribute("data-moving", "true");
      const initial = await sample(page);
      expect(initial.some(letter => Math.abs(letter.y) > 2)).toBe(true);
      await page.screenshot({ path: `test-results/kinetic-${width}-entrance.png` });
      await settled(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Muhammad Yassa");
      await page.screenshot({ path: `test-results/kinetic-${width}-rest.png` });
      const slot = page.locator(".kinetic-slot").nth(3);
      const box = await slot.boundingBox();
      const x = box.x + box.width / 2, y = box.y + box.height / 2;
      const client = await context.newCDPSession(page);
      const touch = async (type, px = x, py = y) => client.send("Input.dispatchTouchEvent", {
        type, touchPoints: type === "touchEnd" || type === "touchCancel" ? [] : [{ x: px, y: py, id: 1 }],
      });
      if (width === 1440) {
        await page.mouse.move(x - 90, y + 20);
        await page.mouse.move(x - 6, y + 15, { steps: 12 });
        await page.waitForTimeout(350);
        expect((await sample(page)).filter(letter => Math.hypot(letter.x, letter.y) > 1).length).toBeGreaterThan(2);
        await page.screenshot({ path: `test-results/kinetic-${width}-magnetic.png` });
        // A stationary pointer retains the deformation without an idle frame loop.
        await settled(page);
        expect((await sample(page)).some(letter => Math.hypot(letter.x, letter.y) > 1)).toBe(true);
        await page.mouse.move(1100, 120);
        await settled(page);
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 120, y + 80, { steps: 20 });
      } else {
        await touch("touchStart");
        for (let i = 1; i <= 12; i++) {
          await touch("touchMove", x + i * 7, y + i * 4);
          await page.waitForTimeout(20);
        }
      }
      await expect(stage).toHaveAttribute("data-grabbing", "true");
      await page.waitForTimeout(350);
      const dragged = await sample(page);
      expect(dragged[3].x).toBeGreaterThan(20);
      expect(dragged[2].x).toBeGreaterThan(1);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await page.screenshot({ path: `test-results/kinetic-${width}-drag.png` });
      if (width === 390) await touch("touchEnd");
      else { await page.mouse.up(); await page.mouse.move(1100, 120); }
      await settled(page);
      expect((await sample(page)).every(letter => letter.x === 0 && letter.y === 0)).toBe(true);

      // Actual letter tap/click triggers the wave, as does the accessible control.
      await page.evaluate(() => {
        window.wavePeak = 0;
        const start = performance.now();
        const collect = () => {
          for (const node of document.querySelectorAll(".kinetic-letter")) {
            window.wavePeak = Math.max(window.wavePeak, Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m42));
          }
          if (performance.now() - start < 4000) requestAnimationFrame(collect);
        };
        requestAnimationFrame(collect);
      });
      if (width === 390) await slot.tap(); else await slot.click();
      if (width === 1440) await page.mouse.move(1100, 120);
      await expect(stage).toHaveAttribute("data-moving", "true");
      await page.waitForTimeout(180);
      expect(await page.evaluate(() => window.wavePeak)).toBeGreaterThan(8);
      await page.screenshot({ path: `test-results/kinetic-${width}-pluck.png` });
      await settled(page);
      const play = page.getByRole("button", { name: "Play name animation" });
      await play.focus();
      await page.keyboard.press("Enter");
      await expect(stage).toHaveAttribute("data-moving", "true");
      await page.waitForTimeout(180);
      await page.keyboard.press("Space");
      await settled(page);

      // Interrupt a fresh drag; neither pointer cancellation nor lost focus can strand it.
      if (width === 390) { await touch("touchStart"); await touch("touchMove", x + 40, y + 30); await touch("touchCancel"); }
      else {
        await page.mouse.move(x, y); await page.mouse.down();
        await page.mouse.move(x + 80, y + 50);
        await page.evaluate(() => window.dispatchEvent(new Event("blur")));
        await page.mouse.up(); await page.mouse.move(1100, 120);
      }
      await expect(stage).not.toHaveAttribute("data-grabbing", "true");
      await settled(page);
      if (width === 390) {
        // Whitespace beside the name remains a native scrolling surface.
        await touch("touchStart", 365, 260);
        for (let i = 1; i <= 10; i++) {
          await touch("touchMove", 365, 260 - i * 12);
          await page.waitForTimeout(20);
        }
        await touch("touchEnd");
        expect(await page.evaluate(() => scrollY)).toBeGreaterThan(10);
        await page.waitForTimeout(500);
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      }
      await play.click();
      await page.locator("#city").scrollIntoViewIfNeeded();
      await expect(stage).not.toHaveAttribute("data-moving", "true");
      await page.getByRole("button", { name: "Explore WatchMate cinema", exact: true }).click();
      await expect(page.locator("#city-detail")).toContainText("4,298");
      await page.locator("#home").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const metrics = await page.evaluate(() => window.kineticMetrics);
      await writeFile(`test-results/kinetic-metrics-${width}.json`, JSON.stringify(metrics, null, 2));
      expect(metrics.layoutShift).toBeLessThan(0.02);
      expect(errors).toEqual([]);
    } finally {
      const video = page.video();
      await context.close();
      await video.saveAs(resolve(`test-results/kinetic-interaction-${width}.webm`));
    }
  });
}

test("kinetic: resize during drag, keyboard focus, rapid interaction and tablet proportions", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await settled(page);
  const stage = page.locator(".kinetic-stage");
  const box = await page.locator(".kinetic-slot").nth(4).boundingBox();
  await page.mouse.move(box.x + 10, box.y + 30);
  await page.mouse.down();
  await page.mouse.move(box.x + 90, box.y + 90);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.mouse.up();
  await expect(stage).not.toHaveAttribute("data-grabbing", "true");
  const play = page.getByRole("button", { name: "Play name animation" });
  await play.focus();
  expect(await play.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("solid");
  for (let i = 0; i < 5; i++) { await page.keyboard.press("Enter"); await page.waitForTimeout(80); }
  await page.mouse.move(740, 100);
  await settled(page);
  await page.screenshot({ path: "test-results/kinetic-768-rest.png" });
  const report = await new AxeBuilder({ page }).include("#home").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(report.violations, JSON.stringify(report.violations, null, 2)).toEqual([]);
  const frames = await page.evaluate(() => new Promise(resolveFrames => {
    const times = []; let previous = performance.now(), start = previous;
    document.querySelector(".kinetic-pluck").click();
    function tick(now) {
      times.push(now - previous); previous = now;
      if (now - start < 2000) requestAnimationFrame(tick);
      else resolveFrames(times.slice(1).sort((a, b) => a - b));
    }
    requestAnimationFrame(tick);
  }));
  await writeFile("test-results/kinetic-frame-times.json", JSON.stringify({
    environment: "Headless desktop Chrome; emulated tablet viewport, not physical device measurements",
    medianMs: frames[Math.floor(frames.length * 0.5)], p95Ms: frames[Math.floor(frames.length * 0.95)], frames: frames.length,
  }, null, 2));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  for (const width of [390, 320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await settled(page);
    for (const index of [0, 7]) {
      const slot = page.locator(".kinetic-slot").nth(index);
      const bounds = await slot.boundingBox();
      await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await page.mouse.down();
      await expect(slot).toHaveAttribute("data-held", "true");
      await page.mouse.move(index === 0 ? 1 : width - 1, bounds.y + 40, { steps: 8 });
      await page.waitForTimeout(400);
      const glyph = await slot.locator(".kinetic-letter").boundingBox();
      expect(glyph.x).toBeGreaterThanOrEqual(0);
      expect(glyph.x + glyph.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      // Scrolling during a captured drag cancels it without an accidental pluck.
      await page.evaluate(() => window.scrollBy({ top: 40, behavior: "instant" }));
      await expect(stage).not.toHaveAttribute("data-grabbing", "true");
      await page.mouse.up();
      await page.mouse.move(width - 1, 90);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await settled(page);
    }
  }
});

test("kinetic: reduced motion is static, including live preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const stage = page.locator(".kinetic-stage");
  await expect(stage).not.toHaveAttribute("data-moving", "true");
  const ink = page.getByRole("button", { name: "Change name ink color" });
  await ink.focus(); await page.keyboard.press("Enter");
  await expect(stage).toHaveAttribute("data-ink", "true");
  expect((await sample(page)).every(letter => letter.x === 0 && letter.y === 0)).toBe(true);
  await page.screenshot({ path: "test-results/kinetic-390-reduced.png" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("button", { name: "Play name animation" })).toBeVisible();
  await page.getByRole("button", { name: "Play name animation" }).click();
  await expect(stage).toHaveAttribute("data-moving", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(stage).not.toHaveAttribute("data-moving", "true");
  expect((await sample(page)).every(letter => letter.x === 0 && letter.y === 0)).toBe(true);
});
