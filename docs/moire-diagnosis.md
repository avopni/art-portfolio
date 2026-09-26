# Canvas texture and moiré: working diagnosis

## Evidence checked

- Matched Canon `.CR2` files and Lightroom JPGs for `_MG_9307`, `_MG_9314`, and `_MG_9317`.
- The RAWs were independently rendered at full resolution with LibRaw, without Lightroom output sharpening. A fine regular canvas weave is plainly visible at 100% in all three. This establishes that the texture is present before Lightroom export; it does not prove every visible line is a sensor artifact rather than real weave.
- An alternative RAW demosaic method for `_MG_9307` gave a similar visible weave. Demosaicing choice alone is unlikely to be the full answer.
- Embedded Camera Raw metadata in these JPGs records **Sharpness 40**, **Radius 1.0**, **Detail 25**, and **Masking 0**. With Masking 0, Develop sharpening is applied across the canvas texture. The JPG metadata does not reveal Lightroom's separate *output sharpening* choice.
- The shared Lightroom JPGs are 1638 × 2048 px for `_MG_9307` and `_MG_9317`, and 2048 × 2048 px for `_MG_9314`. Downsampling these again for the website can create further display aliasing, especially if the browser then scales them to a third size.

## Lightroom test for one painting

1. Make a virtual copy in Lightroom Classic so the current edit is preserved.
2. View the RAW at **100%**. In Detail, compare Sharpening Amount **0** with the existing **40**. If some edge sharpening is needed, raise Masking while holding Alt/Option so broad painted and canvas areas become black in the mask. Keep Texture and Clarity at or below zero if they emphasize the weave.
3. Export one full-size JPEG or TIFF with **no output sharpening** and no image resizing. This is the reference. Compare at 100%, not fit-to-window.
4. Export another JPEG at a **1500–2000 px long edge**, quality around **85–90**, sRGB, with output sharpening still off. Compare at 100% and normal browser size. The exact best size depends on where the image will appear.
5. If coloured moiré remains in a specific area, try a local Moiré mask. It addresses false colour more directly than grey/luminance weave. Avoid strong global blur, which erases painted marks.

If the full-size, unsharpened export still has objectionable bands, the capture needs attention. A new photograph at a slightly different distance or magnification, while keeping the camera square to the artwork, changes how the weave lands on sensor pixels. Diffuse lighting can also reduce the contrast of the cloth texture. Do not replace the current RAWs until a test capture is compared at 100%.

## Website export

`npm run art:prepare` first applies a mild 1.2-pixel Gaussian prefilter to the already-edited JPGs, then resizes them using Sharp's `mks2021` kernel with `fastShrinkOnLoad: false`. It does **not** add sharpening. The prefilter visibly reduces weave in inspected crops of `_MG_9307` and `_MG_9317` while retaining their painted marks better than a stronger 1.8-pixel test. This is a compromise for the local website preview; it cannot undo texture and sharpening already baked into the source JPGs. Use `node scripts/prepare-art.mjs --no-soften` to make unsoftened copies again. For the best final result, first replace the source JPGs with the Lightroom reference exports above, then rerun the command.
