# EditExport curation and web images

The shared `EditExport` folder contained 69 JPEGs. Sixteen distinct paintings were selected for the gallery as Artworks 08–23. Alternate views of the same paintings, nature photographs, and small paintings photographed against busy surfaces were left out of this first selection. The shared folder was not modified. A local copy of all 69 exports is in ignored `incoming-art/EditExport/`.

| Website work | Source export | Preparation |
| --- | --- | --- |
| 08 | IMG_8649.jpg | Canvas edge cleanup |
| 09 | IMG_8644.jpg | Canvas edge cleanup |
| 10 | IMG_3253.jpg | Canvas edge cleanup |
| 11 | IMG_3254.jpg | Canvas edge cleanup |
| 12 | IMG_4055.jpg | Canvas edge cleanup |
| 13 | IMG_2988.jpg | Canvas edge cleanup |
| 14 | _MG_9318.jpg | Canvas edge cleanup |
| 15 | IMG_2562.jpg | Canvas edge cleanup |
| 16 | IMG_8647-2.jpg | Canvas edge cleanup |
| 17 | IMG_4041.jpg | Original export, resized |
| 18 | IMG_9182.jpg | Original export, resized |
| 19 | IMG_4052.jpg | Original export, resized |
| 20 | IMG_4053.jpg | Original export, resized |
| 21 | IMG_4064.jpg | Original export, resized |
| 22 | IMG_4797.jpg | Original export, resized |
| 23 | IMG_4796.jpg | Original export, resized |

Cleanup mode was `precise-object-edit` through image generation. The prompt for each wall photographed painting was:

> Produce a clean gallery reproduction by straightening the four outer canvas edges into a true rectangle and cropping exactly at those edges. Remove the wall, off-canvas cast shadows, and surrounding room solely by excluding them from the crop. Keep the complete original canvas and painted surface, including edge marks, proportions, colors, visible paint relief and texture. Do not invent, repaint, smooth, stylize, add a frame, or change the artwork. The artwork should fill the output image edge to edge.

The nine full-size cleanup previews are in ignored `incoming-art/edits/`, named after their sources. Image generation can subtly change brushwork or color, so compare these previews to the exports before using them as definitive catalog reproductions. The seven already clean exports were resized directly, without generative editing. `npm run art:prepare-editexport` writes the 16 website WebP files at up to 1500 pixels with quality 86; it does not change the source files.
