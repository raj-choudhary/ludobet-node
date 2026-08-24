const sharp = require('sharp');
const path = require('path');

async function cutoutWallet() {
  const inputJpg = 'C:/Users/MYPC/.gemini/antigravity-ide/brain/206a2c0d-fb69-4040-8855-56c34b327eee/wallet_3d_clean_1787073995134.jpg';
  const outPng = path.join(__dirname, 'assets', 'wallet_vault_3d.png');

  const image = sharp(inputJpg);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const outBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const outIdx = (y * width + x) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Pure white background thresholding with smooth alpha feathering
      // If pixel is near pure white:
      const brightness = (r + g + b) / 3;
      const isWhiteish = r > 240 && g > 240 && b > 240;

      if (isWhiteish && (x < 120 || x > width - 120 || y < 100 || y > height - 80)) {
        outBuffer[outIdx] = 0;
        outBuffer[outIdx + 1] = 0;
        outBuffer[outIdx + 2] = 0;
        outBuffer[outIdx + 3] = 0; // 100% transparent
      } else if (brightness > 250) {
        // Feather edge
        const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) * 20)));
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = alpha;
      } else {
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = 255;
      }
    }
  }

  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .resize(500, 500)
  .png()
  .toFile(outPng);

  console.log('Saved ultra-clean 3D purple gold wallet asset to:', outPng);
}

cutoutWallet().catch(console.error);
