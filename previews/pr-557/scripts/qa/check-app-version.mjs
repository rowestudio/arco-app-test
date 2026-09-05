import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  changedFiles,
  extractAppVersions,
  fail,
  getBaseSha,
  getHeadSha,
  parseVersionException,
  readFromGit,
  readText,
} from './lib.mjs';

const VERSION_PATTERN = /^v[0-9][0-9A-Za-z]*$/;

function singleVersion(label, values) {
  if (values.length === 0) throw new Error(`${label} assignment was not found in active script code.`);
  if (values.length > 1) throw new Error(`${label} has multiple active assignments: ${values.join(', ')}`);
  if (!VERSION_PATTERN.test(values[0])) {
    throw new Error(`${label} does not match the current app version pattern: ${values[0]}`);
  }
  return values[0];
}

export function parseCurrent(html, label) {
  const versions = extractAppVersions(html);
  const appVersion = singleVersion(`${label} APP_VERSION`, versions.appVersion);
  const appVersionName = singleVersion(`${label} APP_VERSION_NAME`, versions.appVersionName);
  if (appVersion !== appVersionName) {
    throw new Error(`${label} APP_VERSION and APP_VERSION_NAME must be identical: ${appVersion} != ${appVersionName}`);
  }
  return appVersion;
}

export function validateVersionPolicy({ headHtml, baseHtml, files, prText }) {
  const currentVersion = parseCurrent(headHtml, 'head');
  const baseVersion = parseCurrent(baseHtml, 'base');
  const indexChanged = files.includes('index.html');
  const versionException = parseVersionException(prText);

  if (!indexChanged && currentVersion !== baseVersion) {
    throw new Error(`index.html was not changed, so APP_VERSION must remain unchanged. Base: ${baseVersion}; Head: ${currentVersion}`);
  }

  if (indexChanged) {
    if (!prText.includes(currentVersion)) {
      throw new Error(`index.html changed, but the PR title/body does not declare the head app version: ${currentVersion}`);
    }
    if (currentVersion === baseVersion && !versionException) {
      throw new Error('index.html changed but APP_VERSION did not change and no valid APP_VERSION_EXCEPTION marker was found.');
    }
  }

  return { baseVersion, currentVersion, indexChanged, versionExceptionUsed: Boolean(versionException) };
}

function main() {
  const baseSha = getBaseSha();
  const headSha = getHeadSha();
  try {
    const result = validateVersionPolicy({
      headHtml: readText(process.env.QA_INDEX_HTML || 'index.html'),
      baseHtml: process.env.QA_BASE_INDEX_HTML ? readText(process.env.QA_BASE_INDEX_HTML) : readFromGit(baseSha, 'index.html'),
      files: changedFiles(baseSha, headSha),
      prText: [
        process.env.QA_PR_TITLE || '',
        process.env.QA_PR_BODY || '',
      ].join('\n'),
    });
    if (process.env.GITHUB_ENV) {
      appendFileSync(process.env.GITHUB_ENV, `QA_VERSION_EXCEPTION_USED=${result.versionExceptionUsed ? 'true' : 'false'}\n`);
    }
    console.log(`App version guardrail passed: ${result.currentVersion}.`);
    if (result.versionExceptionUsed) console.log('APP_VERSION_EXCEPTION marker used.');
  } catch (error) {
    fail(error.message);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
