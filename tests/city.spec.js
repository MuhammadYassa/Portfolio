import { test, expect, chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

for (const width of [1440, 390]) {
  test(`city: real ${width === 390 ? "touch" : "pointer"} exploration, previews, motion lifecycle and recording at ${width}px`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1100 : 844 },
      isMobile: width === 390, hasTouch: width === 390,
      recordVideo: { dir: testInfo.outputPath("video"), size: { width, height: width === 1440 ? 1100 : 844 } },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(() => {
      window.cityMetrics = { layoutShift: 0, longTasks: [] };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.cityMetrics.layoutShift += entry.value; }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.cityMetrics.longTasks.push(entry.duration); }).observe({ type: "longtask", buffered: true });
    });
    const city = page.locator("#city"), panel = page.locator("#city-detail");
    const activate = locator => width === 390 ? locator.tap() : locator.click();
    try {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await city.scrollIntoViewIfNeeded();
      await expect(city).toHaveClass(/city-visible/);
      await page.waitForTimeout(1000);
      await city.screenshot({ path: `test-results/city-${width}-overview.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });

      // Exercise the actual SVG hit targets rather than only the parallel controls.
      const cinema = city.getByRole("button", { name: "Explore WatchMate cinema", exact: true });
      if (width === 1440) {
        await cinema.hover();
        await expect(cinema.locator(".city-footprint")).toHaveCSS("stroke-opacity", "0.8");
        await page.mouse.move(350, 600);
        await expect(city).not.toHaveCSS("--city-x", "0px");
      }
      await activate(cinema);
      await expect(panel.getByRole("heading")).toHaveText("WatchMate");
      await expect(panel).toContainText("4,298");
      await expect(panel.getByRole("link", { name: "Visit WatchMate" })).toHaveAttribute("href", "https://mywatchmate.us");
      await page.waitForTimeout(900);
      await city.screenshot({ path: `test-results/city-${width}-watchmate.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });
      await activate(city.getByRole("button", { name: "Close city preview" }));
      await expect(cinema).toBeFocused();
      await expect(panel).toContainText("Built in New York.");

      for (const [name, content] of [
        ["Explore NYC Housing Intelligence apartments", "856,614"],
        ["Explore Renter Dispute Assistant civic hall", "prefilled official New York PDF forms"],
        ["Explore DNR Events recording studio", "approximately 900 daily active users"],
      ]) {
        await activate(city.getByRole("button", { name, exact: true }));
        await expect(panel).toContainText(content);
        await expect(city.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
        await panel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(750);
      }

      const controls = city.getByRole("group", { name: "Choose a city location", exact: true });
      await activate(controls.getByRole("button", { name: /NYC Housing Intelligence/ }));
      await expect(panel).toContainText("These buildings are illustrative.");
      await expect(panel.getByRole("link", { name: "GitHub repository" })).toHaveAttribute("href", "https://github.com/MuhammadYassa/NYC-Housing-Intelligence-Platform");
      await page.waitForTimeout(900);
      await city.screenshot({ path: `test-results/city-${width}-housing.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });
      const report = await new AxeBuilder({ page }).include("#city").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(report.violations, JSON.stringify(report.violations, null, 2)).toEqual([]);

      await activate(city.getByRole("button", { name: "Pause motion" }));
      await page.waitForTimeout(500);
      const paused = await city.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.effect.getTiming().iterations === Infinity).every(a => a.playState === "paused"));
      expect(paused).toBe(true);
      await activate(controls.getByRole("button", { name: /DNR Events/ }));
      await expect(panel.getByRole("heading")).toHaveText("DNR Events");
      await expect(panel.locator(".city-detail-content")).toHaveCSS("opacity", "1");
      await activate(city.getByRole("button", { name: "Resume motion" }));
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await expect(city).not.toHaveClass(/city-visible/);
      expect(await city.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.effect.getTiming().iterations === Infinity).every(a => a.playState === "paused"))).toBe(true);

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
      const metrics = await page.evaluate(() => window.cityMetrics);
      await writeFile(`test-results/city-metrics-${width}.json`, JSON.stringify(metrics, null, 2));
      expect(metrics.layoutShift).toBeLessThan(0.02);
    } finally {
      const video = page.video();
      await context.close();
      await video.saveAs(resolve(`test-results/city-interaction-${width}.webm`));
    }
  });
}

test("city: keyboard traversal, selection, Escape and focus restoration", async ({ page }) => {
  await page.goto("/");
  const city = page.locator("#city"), panel = page.locator("#city-detail");
  const apartments = city.getByRole("button", { name: "Explore NYC Housing Intelligence apartments", exact: true });
  await apartments.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toContainText("856,614");
  await page.keyboard.press("Tab");
  const civic = city.getByRole("button", { name: "Explore Renter Dispute Assistant civic hall", exact: true });
  await expect(civic).toBeFocused();
  await page.keyboard.press("Space");
  await expect(panel.getByRole("heading")).toHaveText("Renter Dispute Assistant");
  await page.keyboard.press("Escape");
  await expect(civic).toBeFocused();
  await expect(panel).toContainText("Built in New York.");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(panel.getByRole("heading")).toHaveText("WatchMate");
  const controls = city.getByRole("group", { name: "Choose a city location", exact: true });
  const studio = controls.getByRole("button", { name: /DNR Events/ });
  await studio.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(city.getByRole("button", { name: "Close city preview" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(studio).toBeFocused();
});

test("city: reduced motion keeps every location available at 320px", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  const city = page.locator("#city");
  for (const name of ["Explore WatchMate cinema", "Explore NYC Housing Intelligence apartments", "Explore Renter Dispute Assistant civic hall", "Explore DNR Events recording studio"]) {
    await city.getByRole("button", { name, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".city-camera")).toHaveCSS("transform", "none");
  }
  expect(await city.evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("city: no-GPU fallback and isolated rendering measurements", async () => {
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "chrome" : undefined),
    args: ["--disable-gpu", "--disable-webgl"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto("http://127.0.0.1:4173/");
    await page.locator("#city").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => document.createElement("canvas").getContext("webgl"))).toBeNull();
    await page.getByRole("button", { name: "Explore WatchMate cinema", exact: true }).click();
    await expect(page.locator("#city-detail")).toContainText("4,298");
    const frames = await page.evaluate(() => new Promise(resolve => {
      const intervals = [];
      let previous = performance.now(), started = previous;
      const frame = now => {
        intervals.push(now - previous); previous = now;
        if (now - started < 2000) requestAnimationFrame(frame);
        else resolve(intervals.slice(1));
      };
      requestAnimationFrame(frame);
    }));
    frames.sort((a,b) => a-b);
    const client = await page.context().newCDPSession(page);
    await client.send("Performance.enable");
    const measure = async () => {
      const start = await client.send("Performance.getMetrics");
      await page.waitForTimeout(2000);
      const end = await client.send("Performance.getMetrics");
      const value = (result, name) => result.metrics.find(metric => metric.name === name).value;
      return { taskMilliseconds: (value(end,"TaskDuration")-value(start,"TaskDuration"))*1000, scriptMilliseconds: (value(end,"ScriptDuration")-value(start,"ScriptDuration"))*1000 };
    };
    const active = await measure();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const offscreen = await measure();
    const metrics = {
      environment: "Headless Chrome with GPU and WebGL disabled; local host, not a physical phone benchmark",
      frameCount: frames.length,
      medianFrameIntervalMs: frames[Math.floor(frames.length*.5)],
      p95FrameIntervalMs: frames[Math.floor(frames.length*.95)],
      twoSecondWindows: { active, offscreen },
      svgElements: await page.locator(".city-svg *").count(),
    };
    await writeFile("test-results/city-rendering.json", JSON.stringify(metrics,null,2));
    await page.locator("#city").screenshot({ path: "test-results/city-software-rendering.png" });
  } finally { await browser.close(); }
});
