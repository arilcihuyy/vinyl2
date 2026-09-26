import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("portfolio content and controls work without overflow", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Aril" })).toBeVisible();
  await expect(page.getByRole("link", { name: "See the Tracklist" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Meet Aril" })).toBeVisible();

  const widths = testInfo.project.name.startsWith("mobile")
    ? [320, 393, 744]
    : [640, 768, 1024, 1440];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }

  await page.getByRole("link", { name: "See the Tracklist" }).click();
  await expect(page).toHaveURL(/#music$/);
  await expect(page.getByRole("heading", { name: "A side built around Radiohead." })).toBeVisible();

  for (const name of ["Previous track", "Play track", "Next track"]) {
    await expect(page.getByRole("button", { name })).toBeDisabled();
  }
  await expect(page.getByRole("button", { name: /Repeat mode/ })).toBeDisabled();
  await expect(page.locator("#volume")).toBeDisabled();
  await expect(page.getByText("Audio files have not been added")).toBeVisible();
  const tracklist = page.locator("#music ol");
  await expect(tracklist.getByText("Creep", { exact: true })).toBeVisible();
  await expect(tracklist.getByText("Fake Plastic Trees", { exact: true })).toBeVisible();
  await expect(tracklist.getByText("Weird Fishes/Arpeggi", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Mini music player")).toHaveCount(0);

  const navigateTo = async (tabName: string, hash: string) => {
    const desktopLink = page
      .locator("nav[aria-label='Primary navigation']")
      .getByRole("link", { name: new RegExp(tabName) });
    if (await desktopLink.isVisible()) {
      await desktopLink.click();
    } else {
      const menuBtn = page.getByRole("button", { name: /navigation menu/ });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
        await page
          .locator("#mobile-navigation")
          .getByRole("link", { name: new RegExp(tabName) })
          .click();
      } else {
        await page.evaluate((h) => {
          window.location.hash = h;
        }, hash);
      }
    }
  };

  await navigateTo("Interests", "#interests");
  for (const name of ["Programming", "AI", "Web3", "Gaming", "Technology", "Music"]) {
    const control = page
      .locator("#interests")
      .getByRole("button", { name: new RegExp(name) });
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "true");
  }

  await navigateTo("Projects", "#projects");
  await expect(page.getByRole("heading", { name: "No releases yet" })).toBeVisible();
  await expect(page.locator("#projects button")).toHaveCount(0);

  await navigateTo("Contact", "#contact");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/arilcihuyy",
  );
  await expect(contact.getByRole("link", { name: /^X/ })).toHaveAttribute(
    "href",
    "https://x.com/0xAril27",
  );

  await page.getByRole("link", { name: "Back to the top" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);

  await navigateTo("Home", "#top");
  await expect(page.getByRole("heading", { level: 1, name: "Aril" })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("has no automated WCAG A or AA violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Aril" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target),
  }));
  expect(violations).toEqual([]);
});

test("mobile navigation opens, closes, and navigates", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile navigation only");

  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page.getByRole("link", { name: /^Projects/ }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);

  await menuButton.click();
  await page.getByRole("link", { name: /^Home/ }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aril" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("removes smooth scrolling and keeps content readable", async ({ page }) => {
    await page.goto("/");
    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(scrollBehavior).toBe("auto");
    await expect(page.getByRole("heading", { level: 1, name: "Aril" })).toBeVisible();
  });
});
