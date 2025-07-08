const { test, expect } = require('@playwright/test');

test.describe('Web UI Automation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your application's base URL
    await page.goto('/');
  });

  test.describe('Homepage Tests', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Your App Name/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should have working navigation menu', async ({ page }) => {
      // Test navigation links
      await page.click('nav a[href="/about"]');
      await expect(page).toHaveURL(/.*about/);
      
      await page.click('nav a[href="/contact"]');
      await expect(page).toHaveURL(/.*contact/);
    });

    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check if mobile menu appears
      const mobileMenu = page.locator('.mobile-menu-button');
      await expect(mobileMenu).toBeVisible();
    });
  });

  test.describe('Form Tests', () => {
    test('should submit contact form successfully', async ({ page }) => {
      await page.goto('/contact');
      
      // Fill out the form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'This is a test message from automation');
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Verify success message
      await expect(page.locator('.success-message')).toBeVisible();
      await expect(page.locator('.success-message')).toContainText('Thank you');
    });

    test('should validate required form fields', async ({ page }) => {
      await page.goto('/contact');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Check for validation errors
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
      await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/contact');
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('textarea[name="message"]', 'Test message');
      
      await page.click('button[type="submit"]');
      
      // Check for email validation error
      await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should perform search and display results', async ({ page }) => {
      const searchTerm = 'automation';
      
      await page.fill('input[name="search"]', searchTerm);
      await page.press('input[name="search"]', 'Enter');
      
      // Wait for search results
      await page.waitForSelector('.search-results');
      
      // Verify search results contain the search term
      const results = page.locator('.search-result');
      await expect(results.first()).toContainText(searchTerm, { ignoreCase: true });
    });

    test('should handle empty search gracefully', async ({ page }) => {
      await page.press('input[name="search"]', 'Enter');
      
      // Should show appropriate message for empty search
      await expect(page.locator('.no-results')).toBeVisible();
    });
  });

  test.describe('Authentication Tests', () => {
    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"]', 'testuser');
      await page.fill('input[name="password"]', 'testpassword');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard after successful login
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('.welcome-message')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"]', 'invaliduser');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    });

    test('should logout successfully', async ({ page }) => {
      // Assume user is already logged in
      await page.goto('/dashboard');
      await page.click('.logout-button');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Should have exactly one h1
      
      // Check if headings are in logical order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have alt text for images', async ({ page }) => {
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).not.toBeNull();
        expect(alt.length).toBeGreaterThan(0);
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });
});
