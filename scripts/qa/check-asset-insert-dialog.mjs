import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const html = readFileSync(process.env.QA_ASSET_INSERT_HTML || path.join(root, 'index.html'), 'utf8');
const failures = [];
const requireText = (value, message) => { if (!html.includes(value)) failures.push(message); };

requireText('id="assetInsertDialog" role="dialog" aria-modal="true"', 'modal de inserção acessível ausente');
requireText('function openAssetInsertDialog()', 'controlador de abertura ausente');
requireText('function closeAssetInsertDialog()', 'controlador de cancelamento ausente');
requireText('function confirmAssetInsertDialog()', 'controlador de confirmação ausente');
requireText("openAssetInsertDialog();\n}", 'startInsertImageFlow não termina no modal');
requireText("pendingImageAction = 'insertImage';", 'confirmação não congela a intenção de inserção');
requireText('triggerMultiImageInsertPicker();', 'confirmação não abre o picker múltiplo');

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'));
  process.exit(1);
}
console.log('Asset insert dialog guardrail passed.');
