import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

export const root = process.cwd();

export function fail(message, details = []) {
  console.error(`QA guardrail failed: ${message}`);
  for (const detail of details) console.error(`- ${detail}`);
  process.exit(1);
}

export function readText(file) {
  return readFileSync(path.isAbsolute(file) ? file : path.join(root, file), 'utf8');
}

export function fileExists(file) {
  return existsSync(path.isAbsolute(file) ? file : path.join(root, file));
}

export function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['ignore', 'pipe', options.stderr || 'pipe'],
  }).trimEnd();
}

export function gitMaybe(args) {
  try {
    return git(args);
  } catch {
    return '';
  }
}

export function getBaseSha() {
  const verify = (sha, source) => {
    if (!sha) return '';
    const resolved = gitMaybe(['rev-parse', '--verify', `${sha}^{commit}`]);
    if (!resolved) fail(`unable to resolve QA base SHA from ${source}.`, [`Value: ${sha}`]);
    return resolved;
  };
  if (process.env.QA_BASE_SHA) return verify(process.env.QA_BASE_SHA, 'QA_BASE_SHA');
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    fail('QA_BASE_SHA is required for pull_request guardrails.');
  }
  const originMain = gitMaybe(['rev-parse', '--verify', 'origin/main^{commit}']);
  if (originMain) return originMain;
  const localMain = gitMaybe(['rev-parse', '--verify', 'main^{commit}']);
  if (localMain) return localMain;
  fail('unable to resolve a verifiable base SHA for workflow_dispatch/manual QA.');
}

export function getHeadSha() {
  return process.env.QA_HEAD_SHA || git(['rev-parse', 'HEAD']);
}

export function changedFiles(baseSha = getBaseSha(), headSha = getHeadSha()) {
  if (process.env.QA_CHANGED_FILES !== undefined) {
    return process.env.QA_CHANGED_FILES.split(/[\n,]/).map((file) => file.trim()).filter(Boolean);
  }
  const output = git(['diff', '--name-only', `${baseSha}...${headSha}`]);
  return output ? output.split('\n').filter(Boolean) : [];
}

export function readFromGit(ref, file) {
  if (!ref) fail(`missing git ref while reading ${file}.`);
  try {
    return git(['show', `${ref}:${file}`]);
  } catch {
    fail(`unable to read ${file} from git ref ${ref}.`);
  }
}

export function stripJsComments(source) {
  let out = '';
  let i = 0;
  let mode = 'code';
  let quote = '';
  while (i < source.length) {
    const c = source[i];
    const n = source[i + 1];
    if (mode === 'line') {
      if (c === '\n') {
        out += c;
        mode = 'code';
      } else {
        out += ' ';
      }
      i += 1;
      continue;
    }
    if (mode === 'block') {
      if (c === '*' && n === '/') {
        out += '  ';
        i += 2;
        mode = 'code';
      } else {
        out += c === '\n' ? '\n' : ' ';
        i += 1;
      }
      continue;
    }
    if (mode === 'string') {
      out += c;
      if (c === '\\') {
        out += n || '';
        i += 2;
      } else {
        if (c === quote) mode = 'code';
        i += 1;
      }
      continue;
    }
    if (c === '/' && n === '/') {
      out += '  ';
      i += 2;
      mode = 'line';
      continue;
    }
    if (c === '/' && n === '*') {
      out += '  ';
      i += 2;
      mode = 'block';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      mode = 'string';
    }
    out += c;
    i += 1;
  }
  return out;
}

export function extractScriptText(html) {
  const scripts = [];
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) scripts.push(match[1]);
  return scripts.join('\n');
}

export function extractAppVersions(html) {
  const js = stripJsComments(extractScriptText(html));
  const find = (name) => {
    const re = new RegExp(`(?:^|[^\\w$])(?:const|let|var)\\s+${name}\\s*=\\s*(['"])([^'"]+)\\1`, 'g');
    const matches = [];
    let match;
    while ((match = re.exec(js))) matches.push(match[2]);
    return matches;
  };
  return {
    appVersion: find('APP_VERSION'),
    appVersionName: find('APP_VERSION_NAME'),
  };
}

export function markdownLinkTargets(text) {
  const links = [];
  const re = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(text))) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('#')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;
    const target = raw.split('#')[0].replace(/^<|>$/g, '');
    if (target) links.push(target);
  }
  return links;
}

export function parseVersionException(prText) {
  const marker = prText.split(/\r?\n/).find((line) => /^APP_VERSION_EXCEPTION:\s*\S+/.test(line));
  return marker ? marker.replace(/^APP_VERSION_EXCEPTION:\s*/, '').trim() : '';
}
