const sharp = require('sharp');
const path = require('path');

async function findBoardBounds() {
  const original = path.join(__dirname, 'ludo-classic_game_play.png');
  const img = sharp(original);
  const meta = await img.metadata();

  // In 941x1672:
  // The board has a distinct blue outer border.
  // Let's crop the exact board area:
  // Top is around y ~420, bottom around y ~1335 (width around 895, height around 895)
  // Let's test a few crops around y: 420 to 440, x: 20 to 30.
  await img
    .extract({ left: 24, top: 432, width: 893, height: 893 })
    .toFile(path.join(__dirname, 'assets', 'board_exact_crop.png'));

  console.log('Board cropped successfully!');
}

findBoardBounds().catch(console.error);
