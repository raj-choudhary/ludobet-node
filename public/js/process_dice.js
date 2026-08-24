const sharp = require('sharp');
const path = require('path');

async function processDiceImages() {
  const srcDir = path.join(__dirname, 'assets', 'ludodice');
  const outDir = path.join(__dirname, 'assets');

  for (let i = 1; i <= 6; i++) {
    const src = path.join(srcDir, `dice${i}.png`);
    await sharp(src)
      .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(path.join(outDir, `dice_${i}.png`));
  }

  console.log('Dice images processed and optimized into assets/dice_1.png - dice_6.png!');
}

processDiceImages().catch(console.error);
