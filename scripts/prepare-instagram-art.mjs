import sharp from 'sharp';
import { access, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const selected = [
  { number: 8, source: 'edits/IMG_8649-cleaned.png' },
  { number: 9, source: 'edits/IMG_8644-cleaned.png' },
  { number: 10, source: 'edits/IMG_3253-cleaned.png' },
  { number: 11, source: 'edits/IMG_3254-cleaned.png' },
  { number: 12, source: 'edits/IMG_4055-cleaned.png' },
  { number: 13, source: 'edits/IMG_2988-cleaned.png' },
  { number: 14, source: 'edits/_MG_9318-cleaned.png' },
  { number: 15, source: 'edits/IMG_2562-cleaned.png' },
  { number: 16, source: 'edits/IMG_8647-2-cleaned.png' },
  { number: 17, source: 'EditExport/IMG_4041.jpg' },
  { number: 18, source: 'EditExport/IMG_9182.jpg' },
  { number: 19, source: 'EditExport/IMG_4052.jpg' },
  { number: 20, source: 'EditExport/IMG_4053.jpg' },
  { number: 21, source: 'EditExport/IMG_4064.jpg' },
  { number: 22, source: 'EditExport/IMG_4797.jpg' },
  { number: 23, source: 'EditExport/IMG_4796.jpg' }
];

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, 'incoming-art');
const outputDir = join(root, 'public', 'art', 'instagram');
await mkdir(outputDir, { recursive: true });

for (const { number, source } of selected) {
  const input = join(sourceDir, source);
  await access(input);
  const output = join(outputDir, `work-${String(number).padStart(2, '0')}.jpg`);
  await sharp(input)
    .rotate()
    .resize({ width: 1500, height: 1500, fit: 'inside', withoutEnlargement: true, kernel: 'mks2021' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(output);
  console.log(`${source} -> ${output}`);
}
