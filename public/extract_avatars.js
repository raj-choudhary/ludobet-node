const sharp = require('sharp');
const path = require('path');

async function extractAvatars() {
  const original = 'ludo_classic_battle_flow_design.png';
  const outDir = path.join(__dirname, 'assets');

  // Let's crop the 5 avatars from the Open Battles list:
  // Rahul: x: 38, y: 640, w: 42, h: 42
  await sharp(original)
    .extract({ left: 38, top: 638, width: 44, height: 44 })
    .toFile(path.join(outDir, 'avatar_rahul.png'));

  // Amit: x: 38, y: 700, w: 44, h: 44
  await sharp(original)
    .extract({ left: 38, top: 700, width: 44, height: 44 })
    .toFile(path.join(outDir, 'avatar_amit.png'));

  // Vikash: x: 38, y: 760, w: 44, h: 44
  await sharp(original)
    .extract({ left: 38, top: 762, width: 44, height: 44 })
    .toFile(path.join(outDir, 'avatar_vikash.png'));

  // Neha: x: 38, y: 825, w: 44, h: 44
  await sharp(original)
    .extract({ left: 38, top: 825, width: 44, height: 44 })
    .toFile(path.join(outDir, 'avatar_neha.png'));

  // Player 45: x: 38, y: 888, w: 44, h: 44
  await sharp(original)
    .extract({ left: 38, top: 888, width: 44, height: 44 })
    .toFile(path.join(outDir, 'avatar_player45.png'));

  console.log('Avatars extracted!');
}

extractAvatars().catch(console.error);
