import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "logo.jpg");
const appDir = path.join(root, "src", "app");
const publicDir = path.join(root, "public");

async function squarePngBuffer(size) {
  // Next.js ICO/PNG decoding requires RGBA frames.
  return sharp(source)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .toColorspace("srgb")
    .png({ compressionLevel: 9, palette: false, force: true })
    .toBuffer();
}

async function toSquarePng(size, outPath) {
  fs.writeFileSync(outPath, await squarePngBuffer(size));
  console.log("wrote", outPath, size);
}

async function toIco(outPath) {
  // Real ICO with 16/32/48 PNG frames (Google needs valid ICO or PNG)
  const sizes = [16, 32, 48];
  const images = [];
  for (const size of sizes) {
    images.push({ size, png: await squarePngBuffer(size) });
  }

  const headerSize = 6;
  const entrySize = 16;
  const offset0 = headerSize + entrySize * images.length;
  let offset = offset0;
  const entries = [];
  for (const img of images) {
    entries.push({
      width: img.size === 256 ? 0 : img.size,
      height: img.size === 256 ? 0 : img.size,
      bytes: img.png.length,
      offset,
    });
    offset += img.png.length;
  }

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // type = icon
  buf.writeUInt16LE(images.length, 4);

  entries.forEach((entry, i) => {
    const o = headerSize + i * entrySize;
    buf.writeUInt8(entry.width, o);
    buf.writeUInt8(entry.height, o + 1);
    buf.writeUInt8(0, o + 2); // color palette
    buf.writeUInt8(0, o + 3); // reserved
    buf.writeUInt16LE(1, o + 4); // color planes
    buf.writeUInt16LE(32, o + 6); // bits per pixel
    buf.writeUInt32LE(entry.bytes, o + 8);
    buf.writeUInt32LE(entry.offset, o + 12);
    images[i].png.copy(buf, entry.offset);
  });

  fs.writeFileSync(outPath, buf);
  console.log("wrote", outPath, buf.length, "bytes");
}

// Icons are declared explicitly in layout metadata, so the app-router file
// conventions must stay empty to avoid duplicate <link rel="icon"> tags.
for (const name of ["icon.jpg", "apple-icon.jpg", "icon.png", "apple-icon.png", "favicon.ico"]) {
  const p = path.join(appDir, name);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("removed", p);
  }
}

await toIco(path.join(publicDir, "favicon.ico"));
await toSquarePng(192, path.join(publicDir, "icon-192.png"));
await toSquarePng(48, path.join(publicDir, "icon-48.png"));
await toSquarePng(180, path.join(publicDir, "apple-icon.png"));

console.log("done");
