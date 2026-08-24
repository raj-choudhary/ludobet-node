const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractGameplayAssets() {
  const original = path.join(__dirname, 'ludo-classic_game_play.png');
  const outDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(original).metadata();
  console.log('Original dimensions:', meta.width, 'x', meta.height);

  // 1. Blue Pawn Avatar (Bottom-Left Card: left ~48, top ~1400, w ~95, h ~95)
  await sharp(original)
    .extract({ left: 45, top: 1400, width: 98, height: 98 })
    .toFile(path.join(outDir, 'avatar_pawn_blue.png'));

  // 2. Green Pawn Avatar (Top-Right Card: left ~548, top ~265, w ~95, h ~95)
  await sharp(original)
    .extract({ left: 545, top: 260, width: 98, height: 98 })
    .toFile(path.join(outDir, 'avatar_pawn_green.png'));

  // 3. Gold Back/Undo Button (left ~425, top ~155, w ~90, h ~80)
  await sharp(original)
    .extract({ left: 420, top: 155, width: 96, height: 80 })
    .toFile(path.join(outDir, 'btn_back_gold.png'));

  // 4. Background seamless pattern patch (left 0, top 0, width 941, height 1672)
  // Let's create a clean background
  await sharp(original)
    .extract({ left: 0, top: 0, width: meta.width, height: meta.height })
    .toFile(path.join(outDir, 'gameplay_bg_full.png'));

  console.log('Gameplay assets extracted successfully!');
}

extractGameplayAssets().catch(console.error);
