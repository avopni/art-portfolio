import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { readPublicArtworks } from './catalog.mjs';
import { validateCatalog } from './catalog-schema.mjs';

const file = fileURLToPath(new URL('../catalog/artworks.json', import.meta.url));
const catalog = JSON.parse(await readFile(file, 'utf8'));
validateCatalog(catalog);
const publicWorks = await readPublicArtworks(file);
assert.equal(publicWorks.length, catalog.artworks.filter(art => art.displayOnSite).length);
assert.ok(!JSON.stringify(publicWorks).includes('rawSourceImage'));
assert.ok(!JSON.stringify(publicWorks).includes('incoming-art'));
const directory = await mkdtemp(path.join(os.tmpdir(), 'portfolio-catalog-'));
try {
  const candidate = structuredClone(catalog);
  const art = candidate.artworks[0], original = candidate.photos.find(photo => photo.artworkId === art.id);
  candidate.photos.push({ ...original, id: 'test-detail', repoImage: '../public/art/test-detail.webp', rawSourceImage: 'C:\\PRIVATE_SOURCE\\detail.CR2', caption: 'Detail view', sortOrder: 1 });
  art.primaryPhotoId = 'test-detail'; art.sold = true;
  const temporary = path.join(directory, 'artworks.json');
  await writeFile(temporary, JSON.stringify(candidate));
  let works = await readPublicArtworks(temporary), first = works.find(item => item.id === art.id);
  assert.equal(first.photos.length, 2); assert.equal(first.photos[0].id, 'test-detail'); assert.equal(first.image, 'art/test-detail.webp'); assert.equal(first.sold, true);
  assert.ok(!JSON.stringify(works).includes('PRIVATE_SOURCE'));
  candidate.photos.at(-1).displayOnSite = false;
  await writeFile(temporary, JSON.stringify(candidate));
  works = await readPublicArtworks(temporary); first = works.find(item => item.id === art.id);
  assert.equal(first.photos.length, 1); assert.equal(first.image, original.repoImage.slice('../public/'.length));
  art.displayOnSite = false;
  await writeFile(temporary, JSON.stringify(candidate));
  assert.ok(!(await readPublicArtworks(temporary)).some(item => item.id === art.id));
  candidate.artworks.forEach(item => item.displayOnSite = false);
  await writeFile(temporary, JSON.stringify(candidate));
  assert.deepEqual(await readPublicArtworks(temporary), []);
  console.log('Catalog checks passed: relationships, cover selection, visibility, sold status, and private-path exclusion.');
} finally { await rm(directory, { recursive: true, force: true }); }
