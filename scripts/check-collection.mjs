import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { readPublicArtworks } from './catalog.mjs';
import { artworkSize, matchesFilters } from '../src/collection-filters.js';

const artworks = await readPublicArtworks(new URL('../catalog/artworks.json', import.meta.url));
for (const [dimensions, expected] of [['12" x 16"', 'Small'], ['16" x 20"', 'Medium'], ['18" x 24"', 'Medium'], ['40" x 30", $900', 'Large'], ['30" x 40"', 'Large'], ['', null]]) {
  assert.equal(artworkSize({ dimensions }), expected);
}

const source = (await readFile(new URL('../src/main.js', import.meta.url), 'utf8')).replace(/^import .*;\r?\n/gm, '');
function page(pathname) {
  const handlers = {};
  const app = { innerHTML: '', addEventListener(type, handler) { handlers[type] = handler; }, querySelector() { return { focus() {} }; } };
  const document = { body: {}, querySelector() { return app; }, addEventListener() {} };
  vm.runInNewContext(source, { artworks, matchesFilters, document, location: { pathname } });
  return {
    app,
    click(label) { handlers.click({ target: { closest(selector) { return selector === '[data-filter]' ? { dataset: { filter: label } } : null; } } }); },
    ids() { return [...app.innerHTML.matchAll(/data-art="([^"]+)"/g)].map(match => match[1]); },
    selected(label) { return app.innerHTML.includes(`data-filter="${label}" aria-pressed="true"`); }
  };
}

const home = page('/index.html');
for (const title of ['Inner Knowing', 'In Full Bloom']) {
  assert.ok(home.app.innerHTML.includes(`<figcaption class="art-caption">${title}</figcaption>`));
}
assert.ok(home.ids().includes('a05'), 'Retain the existing visible preview');
assert.equal(home.ids().length, 3);

const collection = page('/collection.html');
assert.equal(collection.ids().length, artworks.length);
collection.click('Available');
collection.click('Small');
collection.click('Framed');
const bloom = artworks.find(art => art.title === 'In Full Bloom');
assert.deepEqual(collection.ids(), ['a05', bloom.id]);
for (const label of ['Available', 'Small', 'Framed']) assert.ok(collection.selected(label));
collection.click('Medium');
const radiant = artworks.find(art => art.title === 'Softly Radiant');
assert.deepEqual(collection.ids(), ['a05', bloom.id, radiant.id]);
collection.click('Small');
assert.deepEqual(collection.ids(), [radiant.id]);
collection.click('Framed');
assert.deepEqual(collection.ids(), ['a22', radiant.id]);
collection.click('All');
assert.equal(collection.ids().length, artworks.length);
assert.ok(collection.selected('All'));
for (const label of ['Available', 'Small', 'Medium', 'Framed']) assert.ok(!collection.selected(label));
collection.click('Large');
collection.click('Framed');
assert.equal(collection.ids().length, 0);
assert.ok(collection.app.innerHTML.includes('No paintings match these filters.'));
console.log('Collection checks passed: preview titles, size boundaries, combined filters, toggles, reset, and empty results.');
