import { changedFiles, extractAppVersions, fail, getBaseSha, getHeadSha, readFromGit, readText } from './lib.mjs';

const VERSION_PATTERN = /^v[0-9][0-9A-Za-z]*$/;

function singleVersion(label, values) {
  if (values.length === 0) fail(`${label} assignment was not found in active script code.`);
  if (values.length > 1) fail(`${label} has multiple active assignments.`, values);
  if (!VERSION_PATTERN.test(values[0])) {
    fail(`${label} does not match the current app version pattern.`, [`Found: ${values[0]}`]);
  }
  return values[0];
}

function parseCurrent(html, label) {
  const versions = extractAppVersions(html);
  const appVersion = singleVersion(`${label} APP_VERSION`, versions.appVersion);
  const appVersionName = singleVersion(`${label} APP_VERSION_NAME`, versions.appVersionName);
  if (appVersion !== appVersionName) {
    fail(`${label} APP_VERSION and APP_VERSION_NAME must be identical.`, [
      `APP_VERSION: ${appVersion}`,
      `APP_VERSION_NAME: ${appVersionName}`,
    ]);
  }
  return appVersion;
}

const baseSha = getBaseSha();
const headSha = getHeadSha();
const currentVersion = parseCurrent(readText('index.html'), 'head');
const baseHtml = readFromGit(baseSha, 'index.html');
const baseVersion = baseHtml ? parseCurrent(baseHtml, 'base') : '';
const files = changedFiles(baseSha, headSha);
const indexChanged = files.includes('index.html');
const prText = [
  process.env.QA_PR_TITLE || '',
  process.env.QA_PR_BODY || '',
].join('\n');

if (!indexChanged && baseVersion && currentVersion !== baseVersion) {
  fail('index.html was not changed, so APP_VERSION must remain unchanged.', [
    `Base: ${baseVersion}`,
    `Head: ${currentVersion}`,
  ]);
}

if (indexChanged) {
  if (!prText.includes(currentVersion)) {
    fail('index.html changed, but the PR title/body does not declare the head app version.', [
      `Expected to find: ${currentVersion}`,
    ]);
  }
  const hasExplicitException = /exce[cç][aã]o|exception|justificad[ao]/i.test(prText);
  if (baseVersion && currentVersion === baseVersion && !hasExplicitException) {
    fail('index.html changed but APP_VERSION did not change or include an explicit exception.', [
      `Version: ${currentVersion}`,
    ]);
  }
}

console.log(`App version guardrail passed: ${currentVersion}.`);
