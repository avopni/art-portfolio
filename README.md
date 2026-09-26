# Meghan Vopni — portfolio studies

A local prototype with five quiet gallery directions based on **The Salon**. Four earlier, more varied studies remain available under **Earlier studies**. The site is static, so it can be hosted on GitHub Pages without a server or paid service.

## Run locally

Install [Node.js](https://nodejs.org/) 20.19+ or 22.12+, then from this folder:

```sh
npm install
npm run dev
```

Open the URL shown in the terminal. Use the dark bar at the top to compare **The Salon**, **Gallery Wall**, **The Collector**, **Soft Focus**, and **The Fold**. The chosen theme is kept in the URL, so each can be shared or bookmarked.

`npm run build` produces the ready-to-host `dist/` folder. `npm run preview` serves that production build locally.

## Add actual artwork

The seven JPGs in `public/art/` are reduced-size, lightly softened copies of Meghan's photographs from the shared folder. The originals copied to `incoming-art/` are ignored by Git. `npm run art:prepare` recreates the website copies at 1500 pixels on the long edge, with a mild prefilter to reduce visible canvas weave and no added sharpening. Run `node scripts/prepare-art.mjs --no-soften` to recreate unsoftened copies for comparison. All layouts read from `src/artworks.js`; titles are placeholders until Meghan provides the correct names and dates.

The seven web JPGs from before edge cleanup are backed up locally in `backups/web-art-before-edge-cleanup-2026-09-26/` and are ignored by Git. The site uses cleaned preview PNGs for Artworks 2–7, cropped to the canvas or outer wood frame. Artwork 1 was already cropped to the painted surface. These image-edited previews may differ slightly from the source paintings, so compare them against the corresponding `public/art/work-XX.jpg` copies before using them as final catalog images. Change an image path in `src/artworks.js` to revert any site preview. Edit details and prompts are recorded in `docs/artwork-edge-cleanup.md`.

The current source JPGs already contain visible canvas weave. The web resizing step cannot remove detail captured in the RAW. See `docs/moire-diagnosis.md` for the RAW comparison and recommended Lightroom export test.

The artist statement in `src/main.js` is a temporary draft. Update it with Meghan's own words before publishing. Contact currently links to Instagram; no personal email address is assumed.

## GitHub Pages later

After choosing a theme and confirming titles and statement, you can publish the `dist/` output to a GitHub Pages repository. `vite.config.js` uses relative asset paths so the build works from a repository subpath. There is no deployment or repository connection set up yet.
