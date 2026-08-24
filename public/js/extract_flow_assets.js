const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractFlowAssets() {
  const original = path.join(__dirname, 'ludo_classic_battle_flow_design.png');
  const outDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(original).metadata();
  console.log('Flow image size:', meta.width, 'x', meta.height);

  // 1. 3D Board for Create Battle card (around x: 90, y: 190, w: 250, h: 120 on the 1024x1536 image)
  // Or we can extract it cleanly:
  await sharp(original)
    .extract({ left: 95, top: 185, width: 245, height: 120 })
    .toFile(path.join(outDir, 'board_3d_card.png'));

  // 2. Game Starting 3D Board (around x: 845, y: 1100, w: 120, h: 90)
  await sharp(original)
    .extract({ left: 845, top: 1115, width: 120, height: 95 })
    .toFile(path.join(outDir, 'game_starting_board.png'));

  console.log('Flow assets extracted successfully!');
}

extractFlowAssets().catch(console.error);
