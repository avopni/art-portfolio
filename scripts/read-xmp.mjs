import fs from 'node:fs';

for (const file of process.argv.slice(2)) {
  const source = fs.readFileSync(file).toString('latin1');
  const fields = [...source.matchAll(/crs:([A-Za-z0-9]+)="([^"]*)"/g)]
    .filter(([, key]) => /Sharp|Texture|Clarity|Noise|Moir|Process|Version|Exposure|Contrast|Saturation|Vibrance|RawFileName/.test(key));
  console.log(file);
  for (const [, key, value] of fields) console.log(`  ${key}: ${value}`);
}
