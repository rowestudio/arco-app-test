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
  return readFileSync(path.join(root, file), 'utf8');
}

export function fileExists(file) {
  return existsSync(path.join(root, file));
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
  if (process.env.QA_BASE_SHA) return process.env.QA_BASE_SHA;
  const mainBase = gitMaybe(['merge-base', 'HEAD', 'origin/main']);
  if (mainBase) return mainBase;
  return gitMaybe(['rev-parse', 'HEAD~1']);
}

export function getHeadSha() {
  return process.env.QA_HEAD_SHA || git(['rev-parse', 'HEAD']);
}

export function changedFiles(baseSha = getBaseSha(), headSha = getHeadSha()) {
  if (!baseSha) return [];
  const output = gitMaybe(['diff', '--name-only', `${baseSha}...${headSha}`]);
  return output ? output.split('\n').filter(Boolean) : [];
}

export function readFromGit(ref, file) {
  if (!ref) return '';
  return gitMaybe(['show', `${ref}:${file}`]);
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
