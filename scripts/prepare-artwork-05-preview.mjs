import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const inputPath = join(root, 'incoming-art', '_MG_9314.jpg');
const outputPath = join(root, 'public', 'art', 'work-05-cleaned-preview.png');
const outputWidth = 1280;
const outputHeight = 1600;

// Corners of the outer wood frame in the original 2048x2048 RAW export.
// A projective crop straightens the photographed frame without changing its
// colors or repainting any part of the artwork.
const sourceCorners = [
  [410, 190],
  [1677, 197],
  [1675, 1784],
  [407, 1780]
];
const destinationCorners = [
  [0, 0],
  [outputWidth - 1, 0],
  [outputWidth - 1, outputHeight - 1],
  [0, outputHeight - 1]
];

function solveLinearSystem(matrix, values) {
  const size = values.length;
  const rows = matrix.map((row, index) => [...row, values[index]]);

  for (let column = 0; column < size; column++) {
    let pivot = column;
    for (let row = column + 1; row < size; row++) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
    }
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];

    const divisor = rows[column][column];
    if (Math.abs(divisor) < 1e-12) throw new Error('Frame perspective could not be solved.');
    for (let item = column; item <= size; item++) rows[column][item] /= divisor;

    for (let row = 0; row < size; row++) {
      if (row === column) continue;
      const factor = rows[row][column];
      for (let item = column; item <= size; item++) {
        rows[row][item] -= factor * rows[column][item];
      }
    }
  }

  return rows.map((row) => row[size]);
}

const equations = [];
const values = [];
for (let index = 0; index < 4; index++) {
  const [x, y] = destinationCorners[index];
  const [sourceX, sourceY] = sourceCorners[index];
  equations.push([x, y, 1, 0, 0, 0, -sourceX * x, -sourceX * y]);
  values.push(sourceX);
  equations.push([0, 0, 0, x, y, 1, -sourceY * x, -sourceY * y]);
  values.push(sourceY);
}
const [a, b, c, d, e, f, g, h] = solveLinearSystem(equations, values);

const { data: source, info } = await sharp(inputPath)
  .rotate()
  .toColourspace('srgb')
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.channels !== 3) throw new Error(`Expected RGB pixels, received ${info.channels} channels.`);

const output = Buffer.allocUnsafe(outputWidth * outputHeight * 3);
for (let y = 0; y < outputHeight; y++) {
  for (let x = 0; x < outputWidth; x++) {
    const denominator = g * x + h * y + 1;
    const sourceX = (a * x + b * y + c) / denominator;
    const sourceY = (d * x + e * y + f) / denominator;
    const x0 = Math.floor(sourceX);
    const y0 = Math.floor(sourceY);
    const x1 = Math.min(x0 + 1, info.width - 1);
    const y1 = Math.min(y0 + 1, info.height - 1);
    const xWeight = sourceX - x0;
    const yWeight = sourceY - y0;
    const destinationOffset = (y * outputWidth + x) * 3;

    for (let channel = 0; channel < 3; channel++) {
      const topLeft = source[(y0 * info.width + x0) * 3 + channel];
      const topRight = source[(y0 * info.width + x1) * 3 + channel];
      const bottomLeft = source[(y1 * info.width + x0) * 3 + channel];
      const bottomRight = source[(y1 * info.width + x1) * 3 + channel];
      const top = topLeft * (1 - xWeight) + topRight * xWeight;
      const bottom = bottomLeft * (1 - xWeight) + bottomRight * xWeight;
      output[destinationOffset + channel] = Math.round(top * (1 - yWeight) + bottom * yWeight);
    }
  }
}

await sharp(output, { raw: { width: outputWidth, height: outputHeight, channels: 3 } })
  .withIccProfile('srgb')
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(`Cropped ${inputPath} to ${outputPath} (${outputWidth}x${outputHeight}, no color correction).`);
