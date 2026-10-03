# Meghan Vopni — portfolio studies

A local art portfolio using **The Salon** design. The home page shows two selected works; `collection.html` shows all artwork with All, Detail, Canvas, and Framed filters. Both pages share a pinned header and gallery theme. The site is static, so it can be hosted on GitHub Pages without a server or paid service.

## Run locally

Install [Node.js](https://nodejs.org/) 20.19+ or 22.12+, then from this folder:

```sh
npm install
npm run dev
```

Open the URL shown in the terminal. Click **The Collection** in the header or **View All** below the selected works to open the full gallery. Artwork details and photo relationships are stored in `catalog/artworks.json`; see [the catalog format](docs/catalog.md).

`npm run build` produces the ready-to-host `dist/` folder. `npm run preview` serves that production build locally.

## Artwork sources

Artworks 8–23 were curated from the 69 JPEGs in Meghan's shared `EditExport` folder. Nine wall photographed works received canvas edge and shadow cleanup; seven already clean exports were resized directly. The 16 website WebP copies are in `public/art/`. Originals and full-size cleanup previews are retained locally in ignored `incoming-art/EditExport/` and `incoming-art/edits/`. Run `npm run art:prepare-editexport` to recreate the website copies, `npm run art:prepare-instagram` for JPEG copies of artworks 8–23, and `npm run art:prepare-instagram-clean` to remove provenance metadata from the cleaned previews and make metadata-stripped original and cleaned JPEGs for artworks 3, 4, 6, and 7. See `docs/editexport-curation.md` for the selected sources and cleanup details.

The first seven works came from Meghan's original shared folder. Their source photos are kept locally in ignored `incoming-art/`; `npm run art:prepare` recreates the earlier JPG website copies at 1500 pixels on the long edge, with a mild prefilter to reduce visible canvas weave and no added sharpening. Run `node scripts/prepare-art.mjs --no-soften` to compare unsoftened copies. All layouts read the public fields projected from `catalog/artworks.json`; titles are placeholders until Meghan provides the correct details.

The seven web JPGs from before edge cleanup are backed up locally in `backups/web-art-before-edge-cleanup-2026-09-26/` and are ignored by Git. The site uses cleaned preview PNGs for Artworks 2–7, cropped to the canvas or outer wood frame. Artwork 1 was already cropped to the painted surface. These image-edited previews may differ slightly from the source paintings, so compare them against the corresponding `public/art/work-XX.jpg` copies before using them as final catalog images. Change the photo's `repoImage` pointer in `catalog/artworks.json` to revert any site preview. Edit details and prompts are recorded in `docs/artwork-edge-cleanup.md`.

The current source JPGs already contain visible canvas weave. The web resizing step cannot remove detail captured in the RAW. See `docs/moire-diagnosis.md` for the RAW comparison and recommended Lightroom export test.

The artist statement in `src/main.js` uses Meghan's supplied text. The home page contact section and `contact.html` share a form with Name, Email, Phone number, and Comment fields. The header Contact link opens the dedicated page. Email links and form submissions address `meghanvopni@gmail.com`; Send opens the visitor's email app with the form contents ready to send. Direct web submission requires connecting a form service.

## GitHub Pages later

The repository's `.github/workflows/pages.yml` builds and publishes `dist/` on each push to `main`. `vite.config.js` uses relative asset paths so the build works at `https://avopni.github.io/art-portfolio/`. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**. The workflow can also be started from the **Actions** tab using **Run workflow** after Pages is enabled. GitHub Pages on GitHub Free requires a public repository. Before treating the public site as final, confirm titles, artist statement, and image previews.

