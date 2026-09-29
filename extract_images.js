const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');

async function extractImagesFromPdf(pdfFileName) {
  const pdfPath = path.join(__dirname, pdfFileName);
  if (!fs.existsSync(pdfPath)) {
    console.log(`File not found: ${pdfPath}`);
    return;
  }
  const outputDir = path.join(__dirname, 'public', 'extracted_images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log(`Processing ${pdfFileName} (${pdfDoc.getPageCount()} pages)...`);

  let imgCount = 0;

  for (const [ref, object] of pdfDoc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFRawStream) {
      const dict = object.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        imgCount++;
        const filter = dict.get(PDFName.of('Filter'));
        let ext = 'bin';
        if (filter === PDFName.of('DCTDecode')) {
          ext = 'jpg';
        } else if (filter === PDFName.of('FlateDecode')) {
          ext = 'png';
        }

        const bytes = object.content;
        const width = dict.get(PDFName.of('Width'))?.value;
        const height = dict.get(PDFName.of('Height'))?.value;
        const fileName = `${pdfFileName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9]/g, '_')}_img_${imgCount}_w${width}_h${height}.${ext}`;
        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, bytes);
        console.log(`Saved image #${imgCount}: ${fileName} (${width}x${height})`);
      }
    }
  }
  console.log(`Done ${pdfFileName}: extracted ${imgCount} images.`);
}

async function main() {
  await extractImagesFromPdf('Jogo- CPSFIJ 2026.pdf');
  await extractImagesFromPdf('CPSFIJ-2026 (4).pdf');
}

main().catch(console.error);
