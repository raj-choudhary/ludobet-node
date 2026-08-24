const sharp = require('sharp');
const path = require('path');

async function createClean3DPawns() {
  const original = path.join(__dirname, 'ludo-classic_game_play.png');
  const outDir = path.join(__dirname, 'assets');

  // 1. Blue Pawn (at base row 11, col 2):
  // Let's extract exactly around the blue pawn at x: 104, y: 1056, w: 58, h: 76
  const bluePawnRaw = await sharp(original)
    .extract({ left: 102, top: 1054, width: 62, height: 80 })
    .png()
    .toBuffer();

  // We can make the white background transparent
  const { data, info } = await sharp(bluePawnRaw)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make near-white surrounding pixels transparent
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // If background is white (r>235, g>235, b>235)
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0; // Alpha = 0
    } else if (r > 210 && g > 210 && b > 210) {
      // Soft edge
      data[i + 3] = Math.max(0, 255 - (r - 210) * 5);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
    .png()
    .toFile(path.join(outDir, 'pawn_3d_blue.png'));

  // 2. Green Pawn (at base row 2, col 11):
  const greenPawnRaw = await sharp(original)
    .extract({ left: 642, top: 518, width: 62, height: 80 })
    .png()
    .toBuffer();

  const gObj = await sharp(greenPawnRaw)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < gObj.data.length; i += gObj.info.channels) {
    const r = gObj.data[i];
    const g = gObj.data[i + 1];
    const b = gObj.data[i + 2];
    if (r > 230 && g > 230 && b > 230) {
      gObj.data[i + 3] = 0;
    } else if (r > 210 && g > 210 && b > 210) {
      gObj.data[i + 3] = Math.max(0, 255 - (r - 210) * 5);
    }
  }

  await sharp(gObj.data, {
    raw: {
      width: gObj.info.width,
      height: gObj.info.height,
      channels: gObj.info.channels
    }
  })
    .png()
    .toFile(path.join(outDir, 'pawn_3d_green.png'));

  console.log('Clean 3D Pawns created successfully!');
}

createClean3DPawns().catch(console.error);
