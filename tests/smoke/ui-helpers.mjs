import { expect } from '@playwright/test';

export async function dismissProModalIfVisible(page) {
  const modal = page.locator('#proModal');
  if (!(await modal.isVisible())) return false;

  await modal.getByRole('button', { name:'Dispensar', exact:true }).click();
  await expect(modal).toBeHidden();
  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect(modal).toHaveCSS('pointer-events', 'none');
  return true;
}
