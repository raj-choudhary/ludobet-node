const sharp = require('sharp');
const path = require('path');

async function extractPawnGraphics() {
  const original = 'ludo-classic_game_play.png';
  const outDir = path.join(__dirname, 'assets');

  // Let's crop a blue pawn from bottom-left
  // In 941x1672 image:
  // Board is roughly x: 20 to 920, y: 420 to 1320
  // Blue base is roughly x: 20 to 380, y: 960 to 1320
  await sharp(original)
    .extract({ left: 100, top: 1050, width: 70, height: 90 })
    .toFile(path.join(outDir, 'pawn_blue_sample.png'));

  // Green pawn from top-right
  await sharp(original)
    .extract({ left: 635, top: 515, width: 70, height: 90 })
    .toFile(path.join(outDir, 'pawn_green_sample.png'));

  console.log('Sample pawns cropped!');
}

extractPawnGraphics().catch(console.error);
