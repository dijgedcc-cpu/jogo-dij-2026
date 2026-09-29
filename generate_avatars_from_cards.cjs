const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const characters = [
  'graca', 'luciano', 'jam', 'violeiro', 'jess', 'deby', 'mary', 'august', 'ale_aly'
];

async function generateAvatars() {
  const targetDir = path.join(__dirname, 'public', 'characters');

  for (const charId of characters) {
    let cardFile = path.join(targetDir, `${charId}_card.png`);
    if (!fs.existsSync(cardFile)) {
      cardFile = path.join(targetDir, `${charId}_card.jpg`);
    }
    
    if (fs.existsSync(cardFile)) {
      try {
        const image = await loadImage(cardFile);
        
        // Create a square canvas (e.g., 300x300)
        const size = 300;
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // We want to crop a square from the top part of the card
        // Assuming the face is roughly in the top middle
        const sourceWidth = image.width;
        // Take a square from the source image, centered horizontally
        const cropSize = sourceWidth; 
        const sx = 0;
        // Try to crop a bit below the top edge to get the face
        const sy = Math.floor(image.height * 0.05);

        ctx.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, size, size);

        const avatarPath = path.join(targetDir, `${charId}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(avatarPath, buffer);
        console.log(`✅ Generated avatar for ${charId}`);
      } catch (err) {
        console.error(`❌ Failed to generate avatar for ${charId}: ${err.message}`);
      }
    } else {
       console.log(`⚠️ Card for ${charId} not found.`);
    }
  }
}

generateAvatars().catch(console.error);
