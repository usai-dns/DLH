// Compress images in a directory to fit the DLH asset budget (400KB/image).
// Usage: node scripts/compress-images.mjs [dir=public/images]
import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';

const dir = process.argv[2] || 'public/images';
const LIMIT = 400 * 1024;

for (const f of await readdir(dir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const p = `${dir}/${f}`;
  const before = (await stat(p)).size;
  if (before <= LIMIT) { console.log(`${f}: ${(before / 1024).toFixed(0)}KB ok`); continue; }

  const isPng = /\.png$/i.test(f);
  let q = 82, out;
  for (; q >= 45; q -= 8) {
    const pipeline = sharp(p).rotate().resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });
    out = await (isPng
      ? pipeline.png({ compressionLevel: 9, palette: true })
      : pipeline.jpeg({ quality: q, mozjpeg: true })
    ).toBuffer();
    if (out.length <= LIMIT || isPng) break;
  }
  await sharp(out).toFile(p + '.tmp');
  await rename(p + '.tmp', p);
  const after = (await stat(p)).size;
  console.log(`${f}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB${isPng ? '' : ` (q=${q})`}`);
}
