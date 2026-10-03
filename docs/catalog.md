# Artwork and photo catalog

`catalog/artworks.json` is the source of truth for the collection. It is a versioned JSON file with two related tables:

- `artworks`: stable ID, title, dimensions, style, category, description, Display on site, SOLD, cover-photo ID, and sort order.
- `photos`: stable ID, linked artwork ID, original-file pointer, repo-image pointer, alt text, caption, photo visibility, and sort order.

One artwork can have several photos. Each photo retains its own source and repo locations. Repo pointers are relative to the catalog folder: `../public/art/work-08.webp` resolves to `public/art/work-08.webp`. Original pointers may be local absolute paths, UNC network paths, or paths relative to the catalog folder. A missing original does not affect the website.

An artwork must retain at least one photo. Its cover-photo ID must reference one of its linked photos. Repo image destinations and IDs must be unique. A visible artwork needs at least one visible photo. Hiding the artwork removes it from the collection, home-page selections, and artwork navigation. Hiding a photo removes that image from its artwork viewer. Sold status adds a sold label and does not hide the artwork.

Vite's catalog plugin validates this file and projects an explicit allowlist of public fields. Original file locations are excluded from the generated JavaScript. The development server watches the catalog and reloads when it changes. Builds read the latest catalog automatically; no generated catalog file needs committing.

The gallery uses each piece's visible cover image. Selecting a piece opens the artwork viewer; pieces with multiple visible photos have a thumbnail strip. If a cover is hidden, the first visible photo is used. Home-page selections use stable IDs `a02` and `a05`, with a visible-artwork fallback when needed.

The initial migration preserved all 23 artworks, existing image paths, categories, alt text, and order. Dimensions and styles were left blank pending artist confirmation. It did not modify image files. Original pointers were mapped from the existing preparation scripts and curation notes.

Recoverable catalog/image backups are kept in the ignored `.catalog-backups` folder and are excluded from the website build.

Art Library caches raw source previews locally in `.catalog-backups/source-thumbnails/`. These disposable thumbnails are covered by the `.catalog-backups/` rule in `.gitignore` and never enter the catalog or website build. Cached previews remain visible when an original is disconnected, with a top-right `?` whose tooltip shows the missing path. Clicking it checks the connection again. A preview is cached after its first successful load and regenerated when the source file size or modification time changes.
