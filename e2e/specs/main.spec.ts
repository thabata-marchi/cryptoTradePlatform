import { test, expect } from "@playwright/test";

test.describe("Signup Test", async () => {
    test("Deve criar uma conta", async ({ page }) => {
        await page.goto("http://localhost:5173");
        await page.locator(".input-name").fill("John Doe");
        await page.locator(".input-email").fill("john.doe@gmail.com");
        await page.locator(".input-document").fill("97456321558");
        await page.locator(".input-password").fill("asdQWE123");
        await page.locator(".button-confirm").click();
        await expect(page.locator(".span-message")).toHaveText("success");
    });
    test("Não deve criar uma conta com nome inválido", async ({ page }) => {
        await page.goto("http://localhost:5173");
        await page.locator(".input-name").fill("John");
        await page.locator(".input-email").fill("john.doe@gmail.com");
        await page.locator(".input-document").fill("97456321558");
        await page.locator(".input-password").fill("asdQWE123");
        await page.locator(".button-confirm").click();
        await expect(page.locator(".span-message")).toHaveText("Invalid name");
    });
    test("Não deve criar uma conta com nome email", async ({ page }) => {
        await page.goto("http://localhost:5173");
        await page.locator(".input-name").fill("John Doe");
        await page.locator(".input-email").fill("john.doe");
        await page.locator(".input-document").fill("97456321558");
        await page.locator(".input-password").fill("asdQWE123");
        await page.locator(".button-confirm").click();
        await expect(page.locator(".span-message")).toHaveText("Invalid email");
    });
});
