import { test, expect } from '@playwright/test';

test.describe('MessageCard Component', () => {
  const mockMessage = {
    id: '1',
    type: 'INFORMATION',
    content: 'Test message content',
    applicationName: 'Test App',
    active: true,
    timestamp: new Date().toISOString()
  };

  test.beforeEach(async ({ page }) => {
    // Set up request interception
    await page.route('**/messages**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockMessage])
      });
    });

    // Navigate to the page where MessageCard is rendered
    await page.goto('http://localhost:5173/messages');

    // Wait for the API request to complete
    await page.waitForResponse(response => 
      response.url().includes('/messages') && 
      response.status() === 200
    );

    // Wait for the loading state to disappear
    await page.waitForSelector('.spinner-border', { state: 'hidden' });
  });

  test('displays message content correctly', async ({ page }) => {
    // Wait for the message card to be visible
    await page.waitForSelector('.card');

    // Check if all message information is displayed
    await expect(page.getByText(mockMessage.applicationName)).toBeVisible();
    await expect(page.getByText(mockMessage.content)).toBeVisible();
    await expect(page.getByText(mockMessage.type)).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
  });

  test('applies correct styling based on message type', async ({ page }) => {
    await page.waitForSelector('.card');

    // Check for the correct background color class
    const card = page.locator('.card').first();
    await expect(card).toHaveClass(/bg-info/);
    
    // Check for the correct text color class
    const title = page.locator('.card-title').first();
    await expect(title).toHaveClass(/text-info/);

    // Check for the correct badge color
    const typeBadge = page.locator('.badge').first();
    await expect(typeBadge).toHaveClass(/badge-info/);
  });

  test('handles inactive message display', async ({ page }) => {
    // Update mock response for inactive message
    await page.route('**/messages**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ ...mockMessage, active: false }])
      });
    });

    // Reload page to get new data
    await page.reload();
    await page.waitForResponse(response => 
      response.url().includes('/messages') && 
      response.status() === 200
    );
    await page.waitForSelector('.spinner-border', { state: 'hidden' });

    // Check if the inactive status is displayed correctly
    const statusBadge = page.getByText('Inactive');
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toHaveClass(/badge-secondary/);
  });

  test('displays message ID correctly', async ({ page }) => {
    await page.waitForSelector('.card');

    // Check if the message ID is displayed
    await expect(page.getByText(`ID: ${mockMessage.id}`)).toBeVisible();
  });

  test('handles error state', async ({ page }) => {
    // Mock error response
    await page.route('**/messages**', route => 
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    );

    // Reload page to trigger error
    await page.reload();
    await page.waitForResponse(response => 
      response.url().includes('/messages') && 
      response.status() === 500
    );

    // Check if error message is displayed
    await expect(page.getByText(/Error loading messages/)).toBeVisible();
  });
});
