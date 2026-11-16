import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { profile } from "../src/data/portfolio.js";

test("production page loads without browser errors and has working anchors and assets", async ({
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
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole("link", { name: "Follow the data" }).click();
  await expect(page).toHaveURL(/#housing$/);
  await expect(page.locator("#housing")).toContainText(
    "These are planned, not completed features.",
  );
  await expect(page.locator("#renter")).toContainText("3 engineers");
  if (profile.resume) {
    await expect(page.getByRole("link", { name: "Resume PDF" })).toHaveAttribute("href", profile.resume);
  } else {
    await expect(page.getByRole("link", { name: "Request my resume" })).toHaveAttribute("href", /^mailto:muhammad\.yassa\.dev@gmail\.com/);
  }
  for (const link of await page.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  expect(errors).toEqual([]);
});

test("desktop, tablet, and mobile layouts fit and pass automated accessibility checks", async ({
  page,
}) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("#contact")).toBeAttached();
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
  }
});

test("mobile menu supports keyboard use, Escape, and selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator('button[aria-controls="nav-links"]');
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Work", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#about$/);
});

test("reduced motion and native personal note work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.getByText("A small detail outside the code").click();
  await expect(
    page.getByText("I’m also a One Piece fan.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#home$/);
});

test("portfolio content is readable with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/");
    await expect(
      page.getByRole("heading", { name: "WatchMate", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "muhammad.yassa.dev@gmail.com" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
