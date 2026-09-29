const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createCanvas } = require('canvas');
const { PDFDocument, PDFName, PDFRawStream, PDFRef } = require('pdf-lib');

/**
 * This script properly extracts avatar images from the PDF by combining
 * the RGB image data with its SMask (alpha channel) to produce RGBA PNGs.
 * 
 * In the PDF, circular avatars are stored as pairs:
 * - RGB image (368x368, 3 channels) — the color data  
 * - SMask image (368x368, 1 channel, DeviceGray) — the transparency mask
 */

async function extractAvatarsWithAlpha() {
  const pdfPath = path.join(__dirname, 'CPSFIJ-2026 (4).pdf');
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  console.log('Extracting avatar images with alpha channel...\n');

  // Collect all image objects
  const images = [];
  for (const [ref, object] of pdfDoc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFRawStream) {
      const dict = object.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        const filter = dict.get(PDFName.of('Filter'));
        if (filter !== PDFName.of('FlateDecode')) continue;

        const wObj = dict.get(PDFName.of('Width'));
        const hObj = dict.get(PDFName.of('Height'));
        const width = wObj ? (typeof wObj.numberValue === 'number' ? wObj.numberValue : wObj.value || 0) : 0;
        const height = hObj ? (typeof hObj.numberValue === 'number' ? hObj.numberValue : hObj.value || 0) : 0;

        const colorSpace = dict.get(PDFName.of('ColorSpace'));
        let csName = '';
        if (colorSpace) {
          csName = colorSpace.toString ? colorSpace.toString() : '';
        }
        const isGray = csName.includes('Gray');
        
        // Check for SMask reference
        const smaskRef = dict.get(PDFName.of('SMask'));

        const rawBytes = object.getContents();
        let pixelData;
        try {
          pixelData = zlib.inflateSync(Buffer.from(rawBytes));
        } catch (e) {
          continue;
        }

        images.push({
          ref: ref.toString(),
          width, height,
          isGray,
          csName,
          smaskRef: smaskRef ? smaskRef.toString() : null,
          pixelData,
          refObj: ref
        });
      }
    }
  }

  // Find 368x368 RGB images that have SMask references
  const avatarRgbImages = images.filter(img => img.width === 368 && img.height === 368 && !img.isGray && img.smaskRef);
  const grayImages = images.filter(img => img.width === 368 && img.height === 368 && img.isGray);

  console.log(`Found ${avatarRgbImages.length} RGB avatar images (368x368 with SMask)`);
  console.log(`Found ${grayImages.length} Grayscale mask images (368x368)`);

  // If we couldn't find RGB images with SMask, try pairing by position
  let pairs = [];
  
  if (avatarRgbImages.length > 0) {
    // Match RGB image to its SMask by reference
    for (const rgbImg of avatarRgbImages) {
      const maskImg = images.find(img => img.ref === rgbImg.smaskRef);
      if (maskImg) {
        pairs.push({ rgb: rgbImg, mask: maskImg });
      } else {
        pairs.push({ rgb: rgbImg, mask: null });
      }
    }
  } else {
    // Fallback: look at ALL 368x368 images
    const all368 = images.filter(img => img.width === 368 && img.height === 368);
    console.log(`\nFallback: Found ${all368.length} total 368x368 images`);
    
    // The RGB ones are likely img_15-23 and gray are img_24-32
    // They should be paired: img_15 RGB + img_24 mask, etc.
    const rgb = all368.filter(i => !i.isGray);
    const gray = all368.filter(i => i.isGray);
    
    for (let i = 0; i < Math.min(rgb.length, gray.length); i++) {
      pairs.push({ rgb: rgb[i], mask: gray[i] });
    }
  }

  console.log(`\nPaired ${pairs.length} avatar image pairs (RGB + Alpha mask)\n`);

  const characters = [
    'graca', 'luciano', 'jam', 'violeiro', 'jess', 'deby', 'mary', 'august', 'ale_aly'
  ];
  const targetDir = path.join(__dirname, 'public', 'characters');

  for (let i = 0; i < Math.min(pairs.length, characters.length); i++) {
    const { rgb, mask } = pairs[i];
    const charId = characters[i];
    const w = rgb.width;
    const h = rgb.height;

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);
    const rgba = imageData.data;

    const rgbData = rgb.pixelData;
    const maskData = mask ? mask.pixelData : null;
    
    // Check if RGB data is actually empty/transparent
    let rgbNonZero = 0;
    for (let j = 0; j < Math.min(1000, rgbData.length); j++) {
      if (rgbData[j] !== 0) rgbNonZero++;
    }

    console.log(`${charId}: RGB data non-zero samples: ${rgbNonZero}/1000, RGB length: ${rgbData.length}, expected: ${w*h*3}`);

    if (rgbData.length >= w * h * 3) {
      // Normal RGB + Alpha composite
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pixelIndex = y * w + x;
          const rgbaIndex = pixelIndex * 4;
          const srcIndex = pixelIndex * 3;

          rgba[rgbaIndex] = rgbData[srcIndex];         // R
          rgba[rgbaIndex + 1] = rgbData[srcIndex + 1]; // G
          rgba[rgbaIndex + 2] = rgbData[srcIndex + 2]; // B
          rgba[rgbaIndex + 3] = maskData ? maskData[pixelIndex] : 255; // A from mask
        }
      }
    } else if (rgbData.length >= w * h) {
      // Might be single channel
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pixelIndex = y * w + x;
          const rgbaIndex = pixelIndex * 4;
          const val = rgbData[pixelIndex];
          rgba[rgbaIndex] = val;
          rgba[rgbaIndex + 1] = val;
          rgba[rgbaIndex + 2] = val;
          rgba[rgbaIndex + 3] = maskData ? maskData[pixelIndex] : 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const pngBuffer = canvas.toBuffer('image/png');
    const outPath = path.join(targetDir, `${charId}.png`);
    fs.writeFileSync(outPath, pngBuffer);
    console.log(`  ✅ Saved ${charId}.png (${pngBuffer.length} bytes)`);
  }

  // Check if the RGB images are actually empty, meaning the cards themselves
  // should be used as avatars (cropped/resized from card images)
  const testAvatar = path.join(targetDir, 'graca.png');
  const testBytes = fs.readFileSync(testAvatar);
  console.log(`\nTest: graca.png is ${testBytes.length} bytes`);

  console.log('\n✅ Avatar extraction complete!');
}

extractAvatarsWithAlpha().catch(console.error);
