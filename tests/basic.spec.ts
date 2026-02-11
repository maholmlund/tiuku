import { test, expect } from '@playwright/test';

test('create-poll', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Tiuku' }).nth(1)).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'New Poll' }).click();
  await expect(page.getByRole('heading', { name: 'new' })).toBeVisible();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('baba');
  await page.getByRole('textbox').press('Enter');
  await page.getByRole('button').nth(6).click(); // There is probably a better way but I don't know it yet :)
  await page.getByRole('button').nth(8).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('heading', { name: 'Poll Created' })).toBeVisible();
  let poll_link = page.getByRole('textbox');
  const link = await poll_link.inputValue();
  await page.goto(link);
  await expect(page.getByRole('heading', { name: 'baba' })).toBeVisible();
});
