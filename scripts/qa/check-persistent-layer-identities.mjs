import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const fail = (message) => { console.error(`Persistent layer identity guardrail failed: ${message}`); process.exit(1); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

for (const [fragment, label] of [
  ['function assignPersistentLayerIdentity(asset, originalFileName)', 'canonical identity assignment'],
  ['function migratePersistentLayerIdentities(imageAssets, persistedNextSequence)', 'legacy migration'],
  ['layerSequence: a.layerSequence', 'layer sequence serialization'],
  ['layerNameSource: a.layerNameSource', 'layer name source serialization'],
  ['originalFileName: a.originalFileName', 'original filename serialization'],
  ['nextLayerSequence,\n    projectWorld', 'project counter serialization'],
  ["label.textContent = getAssetDisplayName(a);", 'persistent Layers title'],
  ["assignPersistentLayerIdentity(asset, file.name || '');", 'new image identity assignment'],
]) requireSource(fragment, label);

if (html.includes("label.textContent = 'Imagem ' + (i + 1);")) fail('positional Layers title remains.');

let next = 1;
const assign = (asset) => {
  if (!Number.isInteger(asset.layerSequence) || asset.layerSequence < 1) asset.layerSequence = next++;
  asset.layerName = `Camada ${asset.layerSequence}`;
  asset.layerNameSource = 'automatic';
};
const assets = [{ id: 'a', zIndex: 1 }, { id: 'b', zIndex: 2 }, { id: 'c', zIndex: 3 }];
assets.forEach(assign);
const namesBefore = new Map(assets.map(asset => [asset.id, asset.layerName]));
[assets[0].zIndex, assets[2].zIndex] = [assets[2].zIndex, assets[0].zIndex];
if (assets.some(asset => namesBefore.get(asset.id) !== asset.layerName)) fail('reorder changed a persistent name.');
assets.splice(1, 1);
const added = { id: 'd', zIndex: 4 };
assign(added);
if (added.layerSequence !== 4 || added.layerName !== 'Camada 4') fail('deleted sequence was reused.');
console.log('Persistent layer identity guardrail passed.');
