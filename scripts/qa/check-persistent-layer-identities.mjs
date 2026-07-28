import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const fail = (message) => { throw new Error(`Persistent layer identity guardrail failed: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };
const requireSource = (fragment, label) => assert(html.includes(fragment), `${label} not found.`);

for (const [fragment, label] of [
  ['function assignPersistentLayerIdentity(asset, originalFileName)', 'canonical identity assignment'],
  ['function migratePersistentLayerIdentities(imageAssets, persistedNextSequence)', 'legacy migration'],
  ['layerSequence: a.layerSequence', 'layer sequence serialization'],
  ['layerName: a.layerName', 'layer name serialization'],
  ['layerNameSource: a.layerNameSource', 'layer name source serialization'],
  ['originalFileName: a.originalFileName', 'original filename serialization'],
  ['nextLayerSequence,\n    projectWorld', 'project counter serialization'],
  ["label.textContent = getAssetDisplayName(a);", 'persistent Layers title'],
  ["assignPersistentLayerIdentity(asset, file.name || '');", 'new image identity assignment'],
  ['migratePersistentLayerIdentities(savedImageAssets, data.nextLayerSequence);', 'load migration before render'],
]) requireSource(fragment, label);

const canonicalStart = html.indexOf('let nextLayerSequence = 1;');
const canonicalEnd = html.indexOf('let views = [];', canonicalStart);
assert(canonicalStart >= 0 && canonicalEnd > canonicalStart, 'canonical implementation block cannot be extracted.');
const canonicalSource = html.slice(canonicalStart, canonicalEnd);
function createModel() {
  return new Function(`${canonicalSource}\nreturn {
    assignPersistentLayerIdentity,
    migratePersistentLayerIdentities,
    getNextLayerSequence: () => nextLayerSequence,
    setNextLayerSequence: value => { nextLayerSequence = value; }
  };`)();
}

const displayMatch = html.match(/function getAssetDisplayName\(asset\) \{[\s\S]*?\n\}/);
assert(displayMatch, 'getAssetDisplayName implementation cannot be extracted.');
assert(!displayMatch[0].includes('assignPersistentLayerIdentity'), 'getAssetDisplayName calls the mutating assignment routine.');
assert(!/asset\s*\.[A-Za-z_$][\w$]*\s*=/.test(displayMatch[0]), 'getAssetDisplayName assigns an asset field.');
assert(!displayMatch[0].includes('nextLayerSequence'), 'getAssetDisplayName reads or mutates the counter.');
const getAssetDisplayName = new Function('isValidLayerName', `${displayMatch[0]}\nreturn getAssetDisplayName;`)(
  value => typeof value === 'string' && value.trim().length > 0
);

// Creation 1, 2, 3.
const model = createModel();
const assets = ['a', 'b', 'c'].map(id => model.assignPersistentLayerIdentity({ id, type: 'image' }));
assert(assets.map(a => a.layerSequence).join(',') === '1,2,3', 'creation did not allocate sequences 1, 2, 3.');
assert(assets.map(a => a.layerName).join(',') === 'Camada 1,Camada 2,Camada 3', 'creation names are incorrect.');

// Reorder preserves identity by asset ID.
const beforeReorder = new Map(assets.map(a => [a.id, `${a.layerSequence}|${a.layerName}`]));
[assets[0], assets[2]] = [assets[2], assets[0]];
assert(assets.every(a => beforeReorder.get(a.id) === `${a.layerSequence}|${a.layerName}`), 'reorder changed identity by asset ID.');

// Delete Camada 2, then create Camada 4.
assets.splice(assets.findIndex(a => a.id === 'b'), 1);
const fourth = model.assignPersistentLayerIdentity({ id: 'd', type: 'image' });
assert(fourth.layerSequence === 4 && fourth.layerName === 'Camada 4', 'deleted sequence 2 was reused.');

// Save/Load round trip of identity and counter.
const saved = JSON.parse(JSON.stringify({ assets: [...assets, fourth], nextLayerSequence: model.getNextLayerSequence() }));
const loadedModel = createModel();
loadedModel.migratePersistentLayerIdentities(saved.assets, saved.nextLayerSequence);
assert(saved.nextLayerSequence === loadedModel.getNextLayerSequence(), 'nextLayerSequence did not survive Save/Load.');
assert(saved.assets.every(a => beforeReorder.get(a.id) === `${a.layerSequence}|${a.layerName}` || a.id === 'd'), 'layerSequence/layerName did not survive Save/Load.');

// Full legacy migration.
const fullMigration = createModel();
const legacy = [{ id: 'x', type: 'image' }, { id: 'y', type: 'image' }, { id: 'z', type: 'image' }];
fullMigration.migratePersistentLayerIdentities(legacy);
assert(legacy.map(a => `${a.layerSequence}:${a.layerName}`).join(',') === '1:Camada 1,2:Camada 2,3:Camada 3', 'full legacy migration is not deterministic.');

// Partial migration preserves valid identity and allocates above the maximum.
const partialMigration = createModel();
const partial = [
  { id: 'kept', type: 'image', layerSequence: 4, layerName: 'Camada 4', layerNameSource: 'automatic' },
  { id: 'missing', type: 'image' },
];
partialMigration.migratePersistentLayerIdentities(partial);
assert(partial[0].layerSequence === 4 && partial[0].layerName === 'Camada 4', 'partial migration changed a valid identity.');
assert(partial[1].layerSequence === 5 && partial[1].layerName === 'Camada 5', 'partial migration did not allocate above the maximum.');

// Duplicate sequences are eliminated deterministically.
const duplicateMigration = createModel();
const duplicates = [
  { id: 'first', type: 'image', layerSequence: 1, layerName: 'Camada 1' },
  { id: 'duplicate', type: 'image', layerSequence: 1 },
  { id: 'missing', type: 'image' },
];
duplicateMigration.migratePersistentLayerIdentities(duplicates);
assert(new Set(duplicates.map(a => a.layerSequence)).size === duplicates.length, 'duplicate sequences remain after migration.');
assert(duplicates.map(a => a.layerSequence).join(',') === '1,2,3', 'duplicate migration order is not deterministic.');

// Replace changes the source, not layer identity.
const replaced = { ...partial[0] };
const replaceIdentity = `${replaced.layerSequence}|${replaced.layerName}`;
replaced.src = 'data:image/png;base64,replaced';
replaced.originalFileName = 'replacement.png';
partialMigration.assignPersistentLayerIdentity(replaced, replaced.originalFileName);
assert(`${replaced.layerSequence}|${replaced.layerName}` === replaceIdentity, 'replace changed layerSequence or layerName.');

// Renderer is pure, including incomplete input.
const displayAsset = { layerSequence: 9, layerName: 'Camada 9', layerNameSource: 'automatic' };
const displayBefore = JSON.stringify(displayAsset);
assert(getAssetDisplayName(displayAsset) === 'Camada 9', 'display name does not return the canonical layerName.');
assert(JSON.stringify(displayAsset) === displayBefore, 'getAssetDisplayName mutated the asset.');
const incomplete = { id: 'incomplete', type: 'image' };
const incompleteBefore = JSON.stringify(incomplete);
assert(getAssetDisplayName(incomplete) === '', 'incomplete state should not be repaired by the renderer.');
assert(JSON.stringify(incomplete) === incompleteBefore, 'renderer mutated an incomplete asset.');

// Future user names are preserved without implementing rename UI.
const userNamed = { id: 'user', type: 'image', layerSequence: 12, layerName: 'Minha camada', layerNameSource: 'user' };
const userModel = createModel();
userModel.assignPersistentLayerIdentity(userNamed);
assert(userNamed.layerName === 'Minha camada' && userNamed.layerNameSource === 'user', 'valid user layer name was overwritten.');

console.log('Persistent layer identity guardrail passed.');
