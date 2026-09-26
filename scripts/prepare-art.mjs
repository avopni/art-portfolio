import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const source = path.resolve('incoming-art');
const destination = path.resolve('public/art');
const soften = process.argv.includes('--no-soften') ? 0 : 1.2;
const selected = [
  ['IMG_4794.jpg', 'work-01.jpg'],
  ['_MG_9307.jpg', 'work-02.jpg'],
  ['_MG_9309.jpg', 'work-03.jpg'],
  ['_MG_9313.jpg', 'work-04.jpg'],
  ['_MG_9314.jpg', 'work-05.jpg'],
  ['_MG_9317.jpg', 'work-06.jpg'],
  ['_MG_9322.jpg', 'work-07.jpg']
];

await mkdir(destination, { recursive: true });
for (const [input, output] of selected) {
  const file = path.join(source, input);
  // A small prefilter before reduction suppresses the photographed canvas weave.
  // Build a separate pipeline so this is applied before, rather than after, resize.
  const pixels = soften ? await sharp(file).blur(soften).toBuffer() : file;
  const result = await sharp(pixels)
    .rotate()
    .resize({
      width: 1500,
      height: 1500,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: 'mks2021',
      fastShrinkOnLoad: false
    })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toFile(path.join(destination, output));
  console.log(`${input} → ${output} (${result.width}×${result.height}, prefilter ${soften})`);
}
