const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'characters');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const characters = [
  'graca',
  'luciano',
  'jam',
  'violeiro',
  'jess',
  'deby',
  'mary',
  'august',
  'ale_aly'
];

// Map avatars (img_24 to img_32)
characters.forEach((charId, idx) => {
  const avatarIndex = 24 + idx;
  const srcAvatar = path.join(__dirname, 'public', 'extracted_images', `CPSFIJ_2026__4__img_${avatarIndex}_w368_h368.png`);
  const destAvatar = path.join(targetDir, `${charId}.png`);
  if (fs.existsSync(srcAvatar)) {
    fs.copyFileSync(srcAvatar, destAvatar);
    console.log(`Copied avatar for ${charId} -> ${destAvatar}`);
  } else {
    console.log(`Missing avatar source: ${srcAvatar}`);
  }
});

// Map card images (img_4 to img_12)
const cardImgs = [
  'CPSFIJ_2026__4__img_5_w896_h1195.jpg',
  'CPSFIJ_2026__4__img_4_w572_h1024.png',
  'CPSFIJ_2026__4__img_6_w687_h1024.png',
  'CPSFIJ_2026__4__img_7_w572_h1024.png',
  'CPSFIJ_2026__4__img_8_w572_h1024.png',
  'CPSFIJ_2026__4__img_9_w572_h1024.png',
  'CPSFIJ_2026__4__img_10_w572_h1024.png',
  'CPSFIJ_2026__4__img_11_w572_h1024.png',
  'CPSFIJ_2026__4__img_12_w572_h1024.png'
];

characters.forEach((charId, idx) => {
  const srcCardName = cardImgs[idx];
  const srcCard = path.join(__dirname, 'public', 'extracted_images', srcCardName);
  const ext = path.extname(srcCardName);
  const destCard = path.join(targetDir, `${charId}_card${ext}`);
  if (fs.existsSync(srcCard)) {
    fs.copyFileSync(srcCard, destCard);
    console.log(`Copied card for ${charId} -> ${destCard}`);
  }
});

console.log('Character images setup completed!');
