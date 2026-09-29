const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createCanvas } = require('canvas');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');

/**
 * Rebuilds valid PNG files from raw FlateDecode (zlib) data extracted from PDFs.
 * The original extraction saved raw zlib-compressed pixel data as .png files,
 * but they lack proper PNG headers/structure. This script decompresses the data
 * and uses Canvas to produce real PNG files.
 */

async function rebuildImagesFromPdf(pdfFileName) {
  const pdfPath = path.join(__dirname, pdfFileName);
  if (!fs.existsSync(pdfPath)) {
    console.log(`File not found: ${pdfPath}`);
    return {};
  }

  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log(`\nProcessing ${pdfFileName} (${pdfDoc.getPageCount()} pages)...`);

  const results = {};
  let imgCount = 0;

  for (const [ref, object] of pdfDoc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFRawStream) {
      const dict = object.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        imgCount++;
        const filter = dict.get(PDFName.of('Filter'));
        const rawBytes = object.getContents();

        const wObj = dict.get(PDFName.of('Width'));
        const hObj = dict.get(PDFName.of('Height'));
        const width = wObj ? (typeof wObj.numberValue === 'number' ? wObj.numberValue : wObj.value || 0) : 0;
        const height = hObj ? (typeof hObj.numberValue === 'number' ? hObj.numberValue : hObj.value || 0) : 0;

        const bitsPerComponent = dict.get(PDFName.of('BitsPerComponent'));
        const bpc = bitsPerComponent ? (typeof bitsPerComponent.numberValue === 'number' ? bitsPerComponent.numberValue : bitsPerComponent.value || 8) : 8;

        // Determine color space
        const colorSpace = dict.get(PDFName.of('ColorSpace'));
        let csName = 'DeviceRGB';
        if (colorSpace) {
          if (typeof colorSpace.encodedName === 'string') {
            csName = colorSpace.encodedName.replace('/', '');
          } else if (colorSpace.toString) {
            csName = colorSpace.toString().replace('/', '');
          }
        }
        const channels = csName.includes('Gray') ? 1 : (csName.includes('CMYK') ? 4 : 3);

        const cleanName = pdfFileName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9]/g, '_');

        if (filter === PDFName.of('DCTDecode')) {
          // JPEG — already valid, just save as-is
          const fileName = `${cleanName}_img_${imgCount}_w${width}_h${height}.jpg`;
          results[imgCount] = { fileName, width, height, type: 'jpg' };
          console.log(`  #${imgCount}: JPEG ${width}x${height} — already valid`);
          continue;
        }

        if (filter !== PDFName.of('FlateDecode')) {
          console.log(`  #${imgCount}: Skipping (filter: ${filter})`);
          continue;
        }

        // FlateDecode — decompress zlib data and rebuild as PNG
        let pixelData;
        try {
          pixelData = zlib.inflateSync(Buffer.from(rawBytes));
        } catch (e) {
          console.log(`  #${imgCount}: Failed to decompress (${e.message})`);
          continue;
        }

        const expectedSize = width * height * channels;
        console.log(`  #${imgCount}: FlateDecode ${width}x${height} cs=${csName} ch=${channels} bpc=${bpc} decompressed=${pixelData.length} expected=${expectedSize}`);

        if (pixelData.length < expectedSize || width === 0 || height === 0) {
          console.log(`    -> Size mismatch or zero dimensions, skipping`);
          continue;
        }

        // Use Canvas to create a proper PNG
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        const rgba = imageData.data;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pixelIndex = y * width + x;
            const rgbaIndex = pixelIndex * 4;

            if (channels === 3) {
              // RGB
              const srcIndex = pixelIndex * 3;
              rgba[rgbaIndex] = pixelData[srcIndex];       // R
              rgba[rgbaIndex + 1] = pixelData[srcIndex + 1]; // G
              rgba[rgbaIndex + 2] = pixelData[srcIndex + 2]; // B
              rgba[rgbaIndex + 3] = 255;                     // A
            } else if (channels === 1) {
              // Grayscale
              const val = pixelData[pixelIndex];
              rgba[rgbaIndex] = val;
              rgba[rgbaIndex + 1] = val;
              rgba[rgbaIndex + 2] = val;
              rgba[rgbaIndex + 3] = 255;
            } else if (channels === 4) {
              // CMYK -> RGB conversion
              const srcIndex = pixelIndex * 4;
              const c = pixelData[srcIndex] / 255;
              const m = pixelData[srcIndex + 1] / 255;
              const yy = pixelData[srcIndex + 2] / 255;
              const k = pixelData[srcIndex + 3] / 255;
              rgba[rgbaIndex] = Math.round(255 * (1 - c) * (1 - k));
              rgba[rgbaIndex + 1] = Math.round(255 * (1 - m) * (1 - k));
              rgba[rgbaIndex + 2] = Math.round(255 * (1 - yy) * (1 - k));
              rgba[rgbaIndex + 3] = 255;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const fileName = `${cleanName}_img_${imgCount}_w${width}_h${height}.png`;
        const outputPath = path.join(__dirname, 'public', 'extracted_images', fileName);
        const pngBuffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, pngBuffer);
        console.log(`    -> Saved valid PNG: ${fileName} (${pngBuffer.length} bytes)`);
        results[imgCount] = { fileName, width, height, type: 'png', outputPath };
      }
    }
  }
  return results;
}

async function setupCharacterImages(results) {
  const targetDir = path.join(__dirname, 'public', 'characters');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const extractedDir = path.join(__dirname, 'public', 'extracted_images');

  const characters = [
    'graca', 'luciano', 'jam', 'violeiro', 'jess', 'deby', 'mary', 'august', 'ale_aly'
  ];

  // Avatar mapping: img_24 to img_32 from CPSFIJ-2026 (4).pdf
  console.log('\n=== Setting up avatar images ===');
  characters.forEach((charId, idx) => {
    const avatarIndex = 24 + idx;
    // Look for the rebuilt file
    const pattern = `CPSFIJ_2026__4__img_${avatarIndex}_w368_h368.png`;
    const src = path.join(extractedDir, pattern);
    const dest = path.join(targetDir, `${charId}.png`);
    if (fs.existsSync(src)) {
      // Verify it's a valid PNG (starts with 89 50 4E 47)
      const header = fs.readFileSync(src, null).slice(0, 4);
      if (header[0] === 0x89 && header[1] === 0x50) {
        fs.copyFileSync(src, dest);
        console.log(`  ✅ ${charId}.png — valid PNG copied`);
      } else {
        console.log(`  ❌ ${charId}.png — still invalid (header: ${header.toString('hex')})`);
      }
    } else {
      console.log(`  ⚠️ ${charId}.png — source not found: ${pattern}`);
    }
  });

  // Card mapping
  console.log('\n=== Setting up card images ===');
  const cardImgs = [
    'CPSFIJ_2026__4__img_5_w896_h1195',    // graca - JPG
    'CPSFIJ_2026__4__img_4_w572_h1024',     // luciano
    'CPSFIJ_2026__4__img_6_w687_h1024',     // jam
    'CPSFIJ_2026__4__img_7_w572_h1024',     // violeiro
    'CPSFIJ_2026__4__img_8_w572_h1024',     // jess
    'CPSFIJ_2026__4__img_9_w572_h1024',     // deby
    'CPSFIJ_2026__4__img_10_w572_h1024',    // mary
    'CPSFIJ_2026__4__img_11_w572_h1024',    // august
    'CPSFIJ_2026__4__img_12_w572_h1024'     // ale_aly
  ];

  characters.forEach((charId, idx) => {
    const baseName = cardImgs[idx];

    // Try PNG first, then JPG
    let srcPath, ext;
    if (fs.existsSync(path.join(extractedDir, baseName + '.png'))) {
      srcPath = path.join(extractedDir, baseName + '.png');
      // Verify header
      const header = fs.readFileSync(srcPath, null).slice(0, 4);
      if (header[0] === 0x89 && header[1] === 0x50) {
        ext = '.png';
      } else if (header[0] === 0xFF && header[1] === 0xD8) {
        ext = '.jpg';
      } else {
        console.log(`  ❌ ${charId}_card — invalid file (header: ${header.toString('hex')})`);
        return;
      }
    } else if (fs.existsSync(path.join(extractedDir, baseName + '.jpg'))) {
      srcPath = path.join(extractedDir, baseName + '.jpg');
      ext = '.jpg';
    } else {
      console.log(`  ⚠️ ${charId}_card — source not found`);
      return;
    }

    const dest = path.join(targetDir, `${charId}_card${ext}`);
    fs.copyFileSync(srcPath, dest);
    console.log(`  ✅ ${charId}_card${ext} — copied`);
  });
}

async function main() {
  console.log('=== Rebuilding images from PDFs ===');
  const r1 = await rebuildImagesFromPdf('CPSFIJ-2026 (4).pdf');
  const r2 = await rebuildImagesFromPdf('Jogo- CPSFIJ 2026.pdf');

  await setupCharacterImages({ ...r1, ...r2 });

  console.log('\n✅ Done! All character images have been rebuilt.');
}

main().catch(console.error);
