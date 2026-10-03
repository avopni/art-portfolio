import sharp from 'sharp';
import { access, copyFile, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, 'public', 'art', 'instagram');
const artworks = [3, 4, 6, 7];
await mkdir(outputDir, { recursive: true });

async function stripPngMetadata(file) {
  const image = await readFile(file);
  const signature = image.subarray(0, 8);
  if (signature.toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`Expected a PNG file: ${file}`);
  }

  const metadataChunks = new Set(['caBX', 'eXIf', 'iTXt', 'tEXt', 'zTXt', 'tIME', 'pHYs']);
  const chunks = [signature];
  const removed = [];
  let offset = 8;
  while (offset + 12 <= image.length) {
    const length = image.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > image.length) throw new Error(`Invalid PNG chunk in ${file}`);
    const type = image.toString('ascii', offset + 4, offset + 8);
    if (metadataChunks.has(type)) removed.push(type);
    else chunks.push(image.subarray(offset, end));
    offset = end;
    if (type === 'IEND') break;
  }

  if (removed.length) {
    const temporary = `${file}.metadata-clean.tmp`;
    await writeFile(temporary, Buffer.concat(chunks));
    await copyFile(temporary, file);
    await unlink(temporary);
    console.log(`${file}: removed ${[...new Set(removed)].join(', ')}`);
  }
}

for (const number of artworks) {
  const name = `work-${String(number).padStart(2, '0')}`;
  const variants = [
    { kind: 'original', input: join(root, 'public', 'art', `${name}.jpg`) },
    { kind: 'clean', input: join(root, 'public', 'art', `${name}-cleaned-preview.png`) }
  ];

  await stripPngMetadata(variants[1].input);

  for (const { kind, input } of variants) {
    await access(input);
    const output = join(outputDir, `${name}-${kind}.jpg`);
    const jpeg = await sharp(input)
      .rotate()
      .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
      .toBuffer();
    await writeFile(output, jpeg);
    console.log(`${input} -> ${output} (metadata stripped)`);
  }
}
