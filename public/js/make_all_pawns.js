const sharp = require('sharp');
const path = require('path');

async function generateAllPawnColors() {
  const outDir = path.join(__dirname, 'assets');
  const bluePath = path.join(outDir, 'pawn_3d_blue.png');

  // Red Pawn
  await sharp(bluePath)
    .modulate({
      hue: -140, // Blue to Red
      saturation: 1.2
    })
    .toFile(path.join(outDir, 'pawn_3d_red.png'));

  // Yellow Pawn
  await sharp(bluePath)
    .modulate({
      hue: -190, // Blue to Yellow/Gold
      saturation: 1.3,
      brightness: 1.15
    })
    .toFile(path.join(outDir, 'pawn_3d_yellow.png'));

  console.log('All 4 3D pawns generated successfully!');
}

generateAllPawnColors().catch(console.error);
