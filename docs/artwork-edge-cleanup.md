# Artwork edge cleanup previews

The local site uses cleanup previews for Artworks 2–7. Artwork 3 is a geometric crop of the original photograph; the other previews use built-in imagegen edits to straighten and crop the photographed canvases or outer wood frames. Artwork 1 already fills its image and was left unchanged. The source web JPGs remain alongside the previews in `public/art/`; seven pre-edit copies are backed up locally in `backups/web-art-before-edge-cleanup-2026-09-26/`.

These are visual proofs. Generated edits can subtly change color, paint marks, and texture even when instructed to preserve them. Compare each with its source before using it for a final catalog or sale listing.

## Selected prompts

Each prompt used its corresponding `public/art/work-XX.jpg` as the edit target, except the final Artwork 5 refinement, which used its first generated version.

### Artwork 2

> Use case: precise-object-edit. Edit target: supplied photograph of Artwork 2, a square green and pink painting on unframed canvas. Create a faithful gallery reproduction by straightening the four outer canvas edges into a true square and cropping exactly at those edges. Exclude all grey wall, off-canvas shadows, and uneven lighting outside the canvas. Preserve the complete painted canvas surface, original proportions, colors, texture, and marks. No added border, frame, wall, or shadow. Do not invent or repaint any part of the art.

### Artwork 3

> Use case: precise-object-edit. Edit target: supplied photograph of Artwork 3, a painting in a light wood frame. Create a faithful gallery reproduction by straightening the complete outer wood frame into a true square and cropping exactly at the OUTER wood frame edges. Exclude all grey wall, off-frame shadows, and uneven lighting outside the frame. Keep the entire original wood frame and the full painting inside it, with its colors, brush marks, texture and composition preserved. Do not crop to the inner painting, remove the frame, or invent or repaint any part of the artwork.

### Artwork 4

> Use case: precise-object-edit. Edit target: supplied photograph of Artwork 4, a square orange and gold painting on unframed canvas. Straighten the four visible outer canvas edges into a true square and crop exactly at those edges. Remove only the grey wall and off-canvas shadows by excluding them from the crop. Preserve the entire original painted face, colors, marks, and canvas texture. No added wall, border, frame, or shadow; do not invent or repaint any part of the artwork.

### Artwork 5

> Use case: precise-object-edit. Edit target: supplied photograph of Artwork 5, a vertical abstract painting in a light natural wood frame. Straighten the entire outer wood frame into a precise rectangle and crop exactly at the OUTER edges of the frame. Exclude the grey wall and off-frame shadows. Preserve the entire wood frame, inset shadow gap, and full original painting inside it, with colors, marks, and texture unchanged. Do not crop to the inner painting or remove the frame. Do not invent or repaint any part of the art.

First refinement (superseded because it stretched the portrait into a square):

> Use case: precise-object-edit. This is an already straightened framed painting. Make one precise change: crop away every pixel of WHITE empty margin OUTSIDE the light wood frame. The outermost visible wood frame must touch all four edges of the output image, including the left and right sides. Preserve the framed painting itself exactly, including the frame corners and all painted marks. Do not redraw, recolor, or add anything.

Corrected Artwork 5 cleanup: `public/art/work-05-cleaned-preview.png` is now a geometric crop of the color-developed `_MG_9314.jpg` export from `_MG_9314.CR2`. It keeps the frame's natural portrait proportions and removes the surrounding wall without a color adjustment or repainting. Run `node scripts/prepare-artwork-05-preview.mjs` to recreate it.

> Create a faithful gallery cleanup from the RAW-derived photograph. Correct the camera perspective and crop to the complete outer edges of the light wood frame, removing only the wall outside it. Keep the complete frame visible on all four sides and preserve its natural 4:5 portrait proportions. Do not stretch or square-crop the frame or painting. Preserve the painting, frame, colors, marks, and texture as faithfully as possible; do not redraw or invent anything.

### Artwork 6

> Use case: precise-object-edit. Edit target: supplied photograph of Artwork 6, a vertical orange and peach abstract painting on unframed canvas. Straighten the four outer canvas edges into a true rectangle and crop exactly at those edges. Remove the grey wall and off-canvas shadows by excluding them from the crop. Preserve the entire original painted face including marks that touch the edges, its proportions, color, and canvas texture. No wall, border, frame, or shadow; do not invent or repaint any part of the artwork.

Artwork 7's prompt is in `docs/artwork-07-cleanup.md`.
