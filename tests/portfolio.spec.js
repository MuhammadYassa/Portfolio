import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { profile, projects } from "../src/data/portfolio.js";

test("production content, local assets, navigation, outbound URLs and actual resume download", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Muhammad Yassa",
  );
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#renter")).toContainText("3 engineers");
  await expect(page.locator("#experience")).toContainText(
    "approximately 900 daily active users across iOS and Android",
  );
  for (const project of projects)
    await expect(
      page.locator(`#${project.id} a[href='${project.github}']`),
    ).toBeVisible();
  const resume = page.getByRole("link", {
    name: "Download Resume",
    exact: true,
  });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    resume.click(),
  ]);
  expect(download.suggestedFilename()).toBe("Muhammad-Yassa-Resume.pdf");
  expect(await download.failure()).toBeNull();
  const response = await page.request.get(profile.resume);
  expect(response.ok()).toBe(true);
  const pdf = await response.body();
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  expect(createHash("sha256").update(pdf).digest("hex")).toBe(
    "137a56c3e6437008f1217961891a4e3f9e0834afc25e2053ddbf6075093abbb2",
  );
  for (const link of await page.locator('a[target="_blank"]').all())
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator(`a[href='${profile.linkedin}']`)).toBeVisible();
  await expect(page.locator(`a[href='mailto:${profile.email}']`)).toBeVisible();
  await expect(
    page.locator('a[href*="instagram"], a[href^="tel:"]'),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("desktop, tablet and mobile have no overflow or automated WCAG A/AA violations", async ({
  page,
}) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      report.violations,
      JSON.stringify(report.violations, null, 2),
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/portfolio-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
  }
});

test("mobile disclosure navigation supports keyboard, Escape, immediate reopening and section links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Projects" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/#aboutme$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("authentic screenshot switch and modal support keyboard with focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  const mobile = page.getByRole("button", { name: "Mobile", exact: true });
  await mobile.focus();
  await page.keyboard.press("Enter");
  await expect(mobile).toHaveAttribute("aria-pressed", "true");
  const enlarge = page.getByRole("button", {
    name: "Enlarge WatchMate mobile screenshot",
  });
  await enlarge.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    "/projects/watchmate-mobile.jpg",
  );
  await expect(
    page.getByRole("button", { name: "Close screenshot" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(enlarge).toBeFocused();
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await page
    .getByRole("button", { name: "Enlarge WatchMate desktop screenshot" })
    .click();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    "/projects/watchmate-desktop.jpg",
  );
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  await page.getByRole("button", { name: "Close screenshot" }).click();
  await expect(dialog).not.toBeVisible();
});

test("pipeline stages expose implemented work with keyboard and a stable panel", async ({
  page,
}) => {
  await page.goto("/");
  const panel = page.locator(".pipeline-visual");
  const height = (await panel.boundingBox()).height;
  for (const [name, text] of [
    ["Validate", "geospatial geometries"],
    ["Merge", "roll back and recover"],
    ["Discover", "official ZIPs"],
  ]) {
    const button = page.getByRole("button", { name: new RegExp(name) });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#pipeline-detail")).toContainText(text);
    expect((await panel.boundingBox()).height).toBeCloseTo(height, 2);
  }
});

test("reduced motion disables running animation and preserves every interaction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(
    page.getByText(
      /Outside of programming, I enjoy anime, especially One Piece/,
    ),
  ).toBeAttached();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await page.getByRole("button", { name: "Merge", exact: false }).click();
  await expect(page.locator("#pipeline-detail")).toContainText(
    "roll back and recover",
  );
  await page.waitForTimeout(100);
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#home$/);
});

test("prerendered content, default screenshot, navigation and email remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/");
    await expect(
      page.getByRole("heading", { name: "WatchMate", exact: true }),
    ).toBeVisible();
    await expect(page.locator("#watchmate")).toContainText("Bucket4j");
    await expect(page.locator(".screenshot-stage img")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.locator("#pipeline-detail > div")).toHaveCSS(
      "opacity",
      "1",
    );
    await page
      .getByRole("navigation", { name: "Navigation without JavaScript" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(
      page.getByRole("link", { name: profile.email, exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
