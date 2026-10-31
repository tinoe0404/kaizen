/**
 * scripts/optimize-images.ts
 *
 * Reads photos from /photos-source, optimises them with sharp, and
 * writes the results to /public/images. Also generates
 * /content/generated/photo-meta.json with width, height, and
 * blurDataURL for each output image.
 *
 * Run:  npm run images:optimize
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = path.join(process.cwd(), "photos-source");
const OUTPUT_DIR = path.join(process.cwd(), "public", "images");
const META_PATH = path.join(
  process.cwd(),
  "content",
  "generated",
  "photo-meta.json"
);

const MAX_LONG_EDGE = 2000;
const JPEG_QUALITY = 78;
const BLUR_WIDTH = 16;

interface PhotoMeta {
  width: number;
  height: number;
  blurDataURL: string;
}

function getAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function run() {
  const sourceFiles = getAllFiles(SOURCE_DIR);

  if (sourceFiles.length === 0) {
    console.log("No source photos found in /photos-source/. Nothing to do.");
    return;
  }

  const meta: Record<string, PhotoMeta> = {};
  let processed = 0;
  let skipped = 0;

  for (const srcPath of sourceFiles) {
    const relativePath = path.relative(SOURCE_DIR, srcPath);
    // Always output as .jpg
    const outRelative = relativePath.replace(/\.(png|webp)$/i, ".jpg");
    const outPath = path.join(OUTPUT_DIR, outRelative);

    // Skip if output is newer than source
    if (fs.existsSync(outPath)) {
      const srcStat = fs.statSync(srcPath);
      const outStat = fs.statSync(outPath);
      if (outStat.mtimeMs > srcStat.mtimeMs) {
        // Still need metadata for the existing output
        const existingImg = sharp(outPath);
        const existingMeta = await existingImg.metadata();
        const w = existingMeta.width || 0;
        const h = existingMeta.height || 0;

        const blurBuf = await sharp(outPath)
          .resize(BLUR_WIDTH, undefined, { fit: "inside" })
          .jpeg({ quality: 40 })
          .toBuffer();

        const publicSrc = `/images/${outRelative.replace(/\\/g, "/")}`;
        meta[publicSrc] = {
          width: w,
          height: h,
          blurDataURL: `data:image/jpeg;base64,${blurBuf.toString("base64")}`,
        };
        skipped++;
        continue;
      }
    }

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    // Process: auto-rotate, resize long edge, strip metadata, export JPEG
    const pipeline = sharp(srcPath).rotate(); // auto-rotate from EXIF

    const inputMeta = await pipeline.metadata();
    const inputW = inputMeta.width || 0;
    const inputH = inputMeta.height || 0;
    const longEdge = Math.max(inputW, inputH);

    let resized = pipeline;
    if (longEdge > MAX_LONG_EDGE) {
      if (inputW >= inputH) {
        resized = pipeline.resize(MAX_LONG_EDGE, undefined, {
          fit: "inside",
          withoutEnlargement: true,
        });
      } else {
        resized = pipeline.resize(undefined, MAX_LONG_EDGE, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }
    }

    const outputBuf = await resized
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(outPath, outputBuf);

    // Get final dimensions
    const finalMeta = await sharp(outputBuf).metadata();
    const w = finalMeta.width || 0;
    const h = finalMeta.height || 0;

    // Generate blur placeholder
    const blurBuf = await sharp(outputBuf)
      .resize(BLUR_WIDTH, undefined, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toBuffer();

    const publicSrc = `/images/${outRelative.replace(/\\/g, "/")}`;
    meta[publicSrc] = {
      width: w,
      height: h,
      blurDataURL: `data:image/jpeg;base64,${blurBuf.toString("base64")}`,
    };

    const sizeKB = Math.round(outputBuf.length / 1024);
    console.log(`  ✓ ${publicSrc} (${w}x${h}, ${sizeKB} KB)`);
    processed++;
  }

  // Write photo-meta.json
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2) + "\n");

  console.log(
    `\nDone: ${processed} processed, ${skipped} skipped (already up to date).`
  );
  console.log(`Metadata written to content/generated/photo-meta.json`);
}

run().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});

