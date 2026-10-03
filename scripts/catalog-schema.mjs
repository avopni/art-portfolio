import path from 'node:path';

const text = (value, name, required = false) => {
  if (typeof value !== 'string' || value.length > 20000 || (required && !value.trim())) throw Error(`${name} must be ${required ? 'a nonempty' : 'a'} string.`);
};
export function validateCatalog(catalog) {
  if (!catalog || catalog.schemaVersion !== 1 || !Array.isArray(catalog.artworks) || !Array.isArray(catalog.photos)) throw Error('Expected a version 1 catalog with artworks and photos tables.');
  const ids = new Set(), photoIds = new Set(), destinations = new Set();
  for (const art of catalog.artworks) {
    text(art.id, 'Artwork ID', true);
    if (!/^[a-zA-Z0-9_-]+$/.test(art.id) || ids.has(art.id)) throw Error('Artwork IDs must be unique safe identifiers.');
    ids.add(art.id); text(art.title, 'Title', true);
    for (const key of ['dimensions', 'style', 'category', 'description', 'primaryPhotoId']) text(art[key], key);
    if (typeof art.displayOnSite !== 'boolean' || typeof art.sold !== 'boolean' || !Number.isFinite(art.sortOrder)) throw Error(`Invalid artwork settings for ${art.id}.`);
  }
  for (const photo of catalog.photos) {
    text(photo.id, 'Photo ID', true);
    if (!/^[a-zA-Z0-9_-]+$/.test(photo.id) || photoIds.has(photo.id)) throw Error('Photo IDs must be unique safe identifiers.');
    photoIds.add(photo.id);
    if (!ids.has(photo.artworkId)) throw Error(`Photo ${photo.id} links to a missing artwork.`);
    text(photo.repoImage, 'Repo image', true);
    const normalized = path.posix.normalize(photo.repoImage.replaceAll('\\', '/'));
    if (!normalized.startsWith('../public/art/') || !/^\.(jpg|jpeg|png|webp)$/i.test(path.extname(normalized)) || photo.repoImage.includes('\0')) throw Error('Repo images must be relative paths inside public/art, with JPG, PNG or WebP extensions.');
    if (destinations.has(normalized.toLowerCase())) throw Error('Each photo needs its own repo image destination.');
    destinations.add(normalized.toLowerCase());
    if (photo.rawSourceImage !== null) text(photo.rawSourceImage, 'Raw source');
    for (const key of ['alt', 'caption']) text(photo[key], key);
    if (typeof photo.displayOnSite !== 'boolean' || !Number.isFinite(photo.sortOrder)) throw Error(`Invalid photo settings for ${photo.id}.`);
  }
  for (const art of catalog.artworks) {
    const linked = catalog.photos.filter(photo => photo.artworkId === art.id);
    if (!linked.length) throw Error(`${art.title} must retain at least one photo. Its last photo cannot be moved.`);
    if (!linked.some(photo => photo.id === art.primaryPhotoId)) throw Error(`The cover photo for ${art.title} must belong to it.`);
    if (art.displayOnSite && !linked.some(photo => photo.displayOnSite)) throw Error(`Visible artwork ${art.title} needs at least one visible photo.`);
  }
  return catalog;
}
