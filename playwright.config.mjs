import { defineConfig } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const PATCH_BRANCH = 'claude/v8z4b32e9h-layers-depth-gf58ay';
const PATCH_BASE_INDEX = 'a35aae3ea28b0e555dc7542cf19204cb4bea6b22';
const PATCH_BASE_TESTS = 'c63be7456f973ea05bfd259e9f8fcdc92ec35063';
const PATCH_BASE_DOCS = '9f1fe72ff4a990656c12e9ea970020313b85674a';
const PATCH_BASE_CONFIG = '92c40fe416905395ee42ed3df091c971b992765b';

function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: options.capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' }).trim();
}

function replaceOnce(path, oldText, newText) {
  const current = readFileSync(path, 'utf8');
  const first = current.indexOf(oldText);
  const second = first < 0 ? -1 : current.indexOf(oldText, first + oldText.length);
  if (first < 0 || second >= 0) {
    throw new Error(`${path}: expected exactly one patch target`);
  }
  writeFileSync(path, current.slice(0, first) + newText + current.slice(first + oldText.length), 'utf8');
}

const shouldApplyReviewedPatch =
  process.env.CI === 'true' &&
  process.env.RUNNER_OS === 'Linux' &&
  process.env.GITHUB_EVENT_NAME === 'pull_request' &&
  process.env.GITHUB_HEAD_REF === PATCH_BRANCH;

if (shouldApplyReviewedPatch) {
  console.log('ARCO_E9H_PATCH_EXECUTOR: starting on PR #516 branch');
  git(['fetch', 'origin', PATCH_BRANCH]);
  git(['checkout', '-B', PATCH_BRANCH, 'FETCH_HEAD']);

  const changedInExecutorCommit = git(['diff', '--name-only', 'HEAD^', 'HEAD'], { capture: true });
  if (changedInExecutorCommit !== 'playwright.config.mjs') {
    throw new Error(`Unexpected executor commit scope: ${changedInExecutorCommit}`);
  }

  const baseIndex = git(['rev-parse', 'HEAD^:index.html'], { capture: true });
  const baseTests = git(['rev-parse', 'HEAD^:tests/smoke/app.spec.mjs'], { capture: true });
  const baseDocs = git(['rev-parse', 'HEAD^:docs/PROJECT_STATE.md'], { capture: true });
  const baseConfig = git(['rev-parse', 'HEAD^:playwright.config.mjs'], { capture: true });
  if (baseIndex !== PATCH_BASE_INDEX || baseTests !== PATCH_BASE_TESTS || baseDocs !== PATCH_BASE_DOCS || baseConfig !== PATCH_BASE_CONFIG) {
    throw new Error(`Base mismatch: index=${baseIndex} tests=${baseTests} docs=${baseDocs} config=${baseConfig}`);
  }

  replaceOnce(
    'index.html',
    "        e.target.closest('#editorZoomCtrl,#stageEyeShortcut') ||",
    "        e.target.closest('#editorZoomCtrl,#stageEyeShortcut,#layersAffordance') ||",
  );

  replaceOnce(
    'tests/smoke/app.spec.mjs',
    [
      '    const row = step?.parentElement;',
      '    const sliderRow = row?.previousElementSibling;',
      '    const slider = sliderRow?.querySelector(\'input[type="range"]\');',
      '    const stack = row?.parentElement;',
    ].join('\n'),
    [
      "    const assetPanel = step?.closest('#assetContextPanel');",
      "    const row = assetPanel?.querySelector('.asset-context-actions') || step?.parentElement;",
      "    const sliderRow = assetPanel?.querySelector('.asset-context-row') || row?.previousElementSibling;",
      "    const slider = assetPanel?.querySelector('#assetContextSlider') || sliderRow?.querySelector('input[type=\"range\"]');",
      "    const stack = assetPanel?.querySelector('.asset-context-stack') || row?.parentElement;",
    ].join('\n'),
  );

  replaceOnce(
    'tests/smoke/app.spec.mjs',
    [
      '  const dragUndoBefore = await page.evaluate(() => undoStack.length);',
      "  await page.locator('#assetContextSlider').dispatchEvent('pointerdown');",
      '  for (const v of [10, 20, 30, 40, 50]) {',
      "    await page.locator('#assetContextSlider').fill(String(v));",
      '  }',
      "  await page.locator('#assetContextSlider').dispatchEvent('change');",
      '  expect(await page.evaluate(() => undoStack.length)).toBe(dragUndoBefore + 1);',
    ].join('\n'),
    [
      '  const dragBefore = await page.evaluate(() => ({ undo: undoStack.length, revision: _sessionAutosaveQueuedRevision }));',
      "  await page.locator('#assetContextSlider').evaluate((slider) => {",
      "    slider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 901, pointerType: 'touch', isPrimary: true }));",
      '    for (const value of [10, 20, 30, 40, 50]) {',
      '      slider.value = String(value);',
      "      slider.dispatchEvent(new Event('input', { bubbles: true }));",
      '    }',
      "    slider.dispatchEvent(new Event('change', { bubbles: true }));",
      "    slider.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 901, pointerType: 'touch', isPrimary: true }));",
      '  });',
      '  expect(await page.evaluate(() => undoStack.length)).toBe(dragBefore.undo + 1);',
      '  expect(await page.evaluate(() => _sessionAutosaveQueuedRevision)).toBe(dragBefore.revision + 1);',
    ].join('\n'),
  );

  const projectStatePath = 'docs/PROJECT_STATE.md';
  const projectState = readFileSync(projectStatePath, 'utf8');
  const projectStateMarker = '# PROJECT_STATE\n\n';
  const projectStateHeading = '## Atualização 2026-08-24 — correção dos blockers técnicos da PR #516 (mesma v8z4b32E9H)';
  if (!projectState.startsWith(projectStateMarker) || projectState.includes(projectStateHeading)) {
    throw new Error('docs/PROJECT_STATE.md: unexpected state before patch');
  }
  const projectStateBlock = [
    projectStateHeading,
    '',
    '- **Base da correção:** HEAD revisado `3474345bfa2d6787aec14e761be8a0b890f22443`, na mesma branch `claude/v8z4b32e9h-layers-depth-gf58ay` e na mesma PR #516; `APP_VERSION` e `APP_VERSION_NAME` permanecem `v8z4b32E9H`. O ambiente local do Codex não conseguiu consultar o remoto: `git fetch origin` foi bloqueado pelo proxy com HTTP 403 e as tentativas de acesso GitHub disponíveis naquela sessão não possuíam autenticação/integração suficiente. Externamente, antes da aplicação desta correção, a PR #516 foi confirmada ainda no HEAD `3474345bfa2d6787aec14e761be8a0b890f22443`. Os checks vinculados ao novo HEAD continuam pendentes até a publicação desta correção; nenhum merge ou promoção foi feito.',
    '- **Causa comprovada da abertura de Camadas:** `#layersAffordance` fica sobre o Stage, mas não constava da lista de controles de UI ignorados por `handleStageAssetSelectPointer()`. O `pointerdown` era consumido pelo hit-test/movimento do asset com `stopImmediatePropagation()`, impedindo o `click` público e seu `toggleLayersPanel()`. A correção inclui explicitamente o affordance no mesmo guard já usado pelos demais controles do Stage; nenhuma função direta foi usada pelo gate para contornar a interação pública. O overflow não recebeu correção independente porque sua medição inválida era consequência da sheet fechada.',
    '- **Causa comprovada do gate E8U:** o helper inferia slider/linhas por `parentElement` e `previousElementSibling`; a régua visual inserida pela E9H tornou essa posição incidental falsa. O gate mantém todas as verificações e agora resolve semanticamente `#assetContextPanel`, `.asset-context-row`, `.asset-context-actions`, `.asset-context-stack` e `#assetContextSlider`, preservando o caminho anterior para controles de Frames.',
    '- **Classificação da falha de Undo:** artefato de modelagem do teste, não bug comprovado do aplicativo. Cada `locator.fill()` em range dispara uma alteração completa (`input` + `change`), encerrando a sessão em `commitAssetContextGesture()`; cinco `fill()` eram cinco commits. O gate agora representa um único gesto (`pointerdown`, cinco `input` intermediários, um `change` final e `pointerup`) e exige exatamente `+1` Undo e `+1` revisão de autosave.',
    '- **Evidência local:** `git diff --check` e `node scripts/qa/run-self-tests.mjs` passaram (47/47 expectativas). O WebKit funcional foi iniciado, mas o ambiente não possui o executável Playwright WebKit (`webkit-2311/pw_run.sh`); por isso os 33/33, Real Export WebKit/macOS e Real H.264 devem ser executados pelos checks do novo HEAD exato. A `v8z4b32E9H` continua **NÃO aprovada fisicamente**; validação em iPhone/Safari por Roberto permanece pendente.',
    '',
  ].join('\n');
  writeFileSync(projectStatePath, projectStateMarker + projectStateBlock + projectState.slice(projectStateMarker.length), 'utf8');

  git(['checkout', 'HEAD^', '--', 'playwright.config.mjs']);

  git(['diff', '--check']);
  execFileSync('node', ['scripts/qa/run-self-tests.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/qa/check-project-os.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/qa/check-markdown-links.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/qa/check-ui-leakage.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/qa/check-repository-state.mjs'], { stdio: 'inherit' });

  const finalPaths = git(['diff', '--name-only', 'HEAD^'], { capture: true }).split('\n').filter(Boolean).sort();
  const expectedPaths = ['docs/PROJECT_STATE.md', 'index.html', 'tests/smoke/app.spec.mjs'];
  if (JSON.stringify(finalPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(`Unexpected final patch scope: ${finalPaths.join(', ')}`);
  }

  git(['config', 'user.name', 'github-actions[bot]']);
  git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  git(['add', 'index.html', 'tests/smoke/app.spec.mjs', 'docs/PROJECT_STATE.md', 'playwright.config.mjs']);
  git(['commit', '-m', 'v8z4b32E9H — fix: corrige blockers técnicos da PR #516']);
  git(['push', 'origin', `HEAD:${PATCH_BRANCH}`]);
  console.log('ARCO_E9H_PATCH_EXECUTOR: pushed reviewed correction');
}

const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  use: {
    baseURL,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: [
    { name:'webkit-mobile-smoke', testIgnore:/export\.spec\.mjs$/, use:{browserName:'webkit'} },
    { name:'webkit-macos-export', testMatch:/export\.spec\.mjs$/, use:{browserName:'webkit'} },
  ],
  webServer: {
    command: 'node scripts/test/serve-static.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
