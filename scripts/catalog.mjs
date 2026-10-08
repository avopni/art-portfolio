import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateCatalog } from './catalog-schema.mjs';

export async function readPublicArtworks(catalogPath) {
  const catalog = validateCatalog(JSON.parse(await readFile(catalogPath, 'utf8')));
  return catalog.artworks.filter(art => art.displayOnSite).sort((a, b) => a.sortOrder - b.sortOrder).map(art => {
    const photos = catalog.photos.filter(photo => photo.artworkId === art.id && photo.displayOnSite).sort((a, b) => a.sortOrder - b.sortOrder).map(photo => ({
      id: photo.id, image: path.posix.normalize(photo.repoImage.replaceAll('\\', '/')).slice('../public/'.length), alt: photo.alt || art.title, caption: photo.caption
    }));
    const cover = photos.find(photo => photo.id === art.primaryPhotoId) || photos[0];
    photos.sort((a, b) => (a.id === cover.id ? -1 : b.id === cover.id ? 1 : 0));
    return { id: art.id, title: art.title, dimensions: art.dimensions, style: art.style, category: art.category, description: art.sold ? [art.description?.replace(/\s*SOLD\s*$/i, '').trim(), 'SOLD'].filter(Boolean).join(' ') : art.description, sold: art.sold, image: cover.image, alt: cover.alt, photos };
  });
}

export function catalogPlugin(catalogPath) {
  const resolvedId = '\0virtual:art-catalog';
  return {
    name: 'artwork-catalog',
    resolveId(id) { if (id === 'virtual:art-catalog') return resolvedId; },
    async load(id) { if (id === resolvedId) { this.addWatchFile(catalogPath); return `export const artworks = ${JSON.stringify(await readPublicArtworks(catalogPath))};`; } },
    configureServer(server) { server.watcher.add(catalogPath); },
    handleHotUpdate(context) {
      if (path.resolve(context.file) !== path.resolve(catalogPath)) return;
      const module = context.server.moduleGraph.getModuleById(resolvedId);
      if (module) context.server.moduleGraph.invalidateModule(module);
      context.server.ws.send({ type: 'full-reload' });
      return [];
    }
  };
}
