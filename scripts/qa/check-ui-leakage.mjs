import { pathToFileURL } from 'node:url';
import { fail, readText } from './lib.mjs';

const KEYWORDS = ['PROBLEMA', 'CORREÇÃO', 'INSTRUÇÕES', 'PROMPT', 'CHANGELOG', 'DIAGNÓSTICO', 'DIAGNOSTICO'];
const ALLOWED_STATIC_TEXT = [/^DIAGN[ÓO]STICO$/i];
const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'br', 'button', 'canvas', 'caption', 'dd', 'details',
  'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'option', 'p', 'pre',
  'section', 'select', 'summary', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead',
  'tr', 'ul',
]);

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function bodyStaticTextChunks(html) {
  const bodyMatch = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  if (!bodyMatch) return [];
  const bodyStart = bodyMatch.index + bodyMatch[0].indexOf(bodyMatch[1]);
  const source = bodyMatch[1];
  const chunks = [];
  let text = '';
  let textLine = 1 + html.slice(0, bodyStart).split('\n').length - 1;
  let line = textLine;
  let i = 0;
  let skipTag = '';

  const flush = () => {
    const decoded = decodeEntities(text).replace(/\s+/g, ' ').trim();
    if (decoded) chunks.push({ line: textLine, text: decoded });
    text = '';
    textLine = line;
  };

  while (i < source.length) {
    if (source.startsWith('<!--', i)) {
      flush();
      const end = source.indexOf('-->', i + 4);
      const segment = source.slice(i, end === -1 ? source.length : end + 3);
      line += (segment.match(/\n/g) || []).length;
      i += segment.length;
      continue;
    }
    if (source[i] === '<') {
      const tagMatch = /^<\/?\s*([a-zA-Z0-9-]+)/.exec(source.slice(i));
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const end = source.indexOf('>', i + 1);
      const tagText = source.slice(i, end === -1 ? source.length : end + 1);
      const isClosing = /^<\s*\//.test(tagText);
      const isBlock = BLOCK_TAGS.has(tagName);
      if (isBlock) flush();
      line += (tagText.match(/\n/g) || []).length;
      i += tagText.length;
      if (['script', 'style'].includes(tagName) && !isClosing) skipTag = tagName;
      if (skipTag) {
        const closeRe = new RegExp(`</\\s*${skipTag}\\s*>`, 'i');
        const rest = source.slice(i);
        const close = closeRe.exec(rest);
        const skipped = close ? rest.slice(0, close.index + close[0].length) : rest;
        line += (skipped.match(/\n/g) || []).length;
        i += skipped.length;
        skipTag = '';
      }
      if (isBlock && !isClosing) textLine = line;
      continue;
    }
    if (!text) textLine = line;
    text += source[i];
    if (source[i] === '\n') line += 1;
    i += 1;
  }
  flush();
  return chunks;
}

export function scanUiLeakage(html, fileLabel = 'index.html') {
  const hits = [];
  for (const chunk of bodyStaticTextChunks(html)) {
    if (ALLOWED_STATIC_TEXT.some((rule) => rule.test(chunk.text))) continue;
    const compact = chunk.text.replace(/\s+/g, '');
    for (const keyword of KEYWORDS) {
      if (chunk.text.includes(keyword) || compact.includes(keyword)) {
        hits.push(`${fileLabel}:${chunk.line}: ${keyword} in "${chunk.text.slice(0, 160)}"`);
      }
    }
  }
  return hits;
}

function main() {
  const file = process.env.QA_INDEX_HTML || 'index.html';
  const hits = scanUiLeakage(readText(file), file);
  if (hits.length) {
    fail('possible technical text leakage in static renderable body text.', [
      ...hits,
      'Heuristic limits: comments, script and style are ignored; inline text is joined; block-level text is separated; visual testing is still required.',
    ]);
  }
  console.log('UI leakage heuristic passed.');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
