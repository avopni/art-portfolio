import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Pass a source JPG path.');
const outputDir = path.resolve('incoming-art/raw-test');
await mkdir(outputDir, { recursive: true });
const stem = path.basename(source, path.extname(source));
const input = await readFile(source);
const jpeg = { quality: 88, chromaSubsampling: '4:4:4' };

const plain = await sharp(input)
  .resize({ height: 1500, withoutEnlargement: true, kernel: 'mks2021', fastShrinkOnLoad: false })
  .jpeg(jpeg)
  .toFile(path.join(outputDir, `${stem}-mks.jpg`));

// Make the small prefilter explicit: a new pipeline ensures blur happens before resize.
const variants = {};
for (const sigma of [0.55, 1.2, 1.8]) {
  const prefiltered = await sharp(input).blur(sigma).toBuffer();
  const result = await sharp(prefiltered)
    .resize({ height: 1500, withoutEnlargement: true, kernel: 'mks2021', fastShrinkOnLoad: false })
    .jpeg(jpeg)
    .toFile(path.join(outputDir, `${stem}-blur-${sigma}.jpg`));
  variants[sigma] = `${result.width}x${result.height}`;
}

console.log({ plain: `${plain.width}x${plain.height}`, variants });
