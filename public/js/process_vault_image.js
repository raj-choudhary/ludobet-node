const sharp = require('sharp');
const path = require('path');

async function processVaultImage() {
  const inputJpg = 'C:/Users/MYPC/.gemini/antigravity-ide/brain/206a2c0d-fb69-4040-8855-56c34b327eee/wallet_3d_render_1787073633635.jpg';
  const outPng = path.join(__dirname, 'assets', 'wallet_vault_3d.png');

  // Let's remove the faux-transparency checkerboard by keying out the grey-white squares or masking with a smooth glowing dark circle/shield
  // Since the background has light gray/white checkered pattern, let's process pixel by pixel:
  const image = sharp(inputJpg);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 3 for jpg

  const outBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const outIdx = (y * width + x) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Check if it's the checkerboard background
      // Faux checkerboard in AI gens consists of neutral grays:
      // Square 1: ~#e0e0e0 (200-240), Square 2: ~#ffffff (245-255)
      // and |r-g| < 10, |g-b| < 10, |r-b| < 10
      const isNeutral = Math.abs(r - g) <= 8 && Math.abs(g - b) <= 8 && Math.abs(r - b) <= 8;
      const isBright = r > 180 && g > 180 && b > 180;

      // Also check outside the main bounding box of the vault
      // Vault is roughly centered from x: 80 to 940, y: 50 to 950
      if (isNeutral && isBright && (x < 100 || x > 920 || y < 60 || y > 950 || (y < 120 && x > 600))) {
        outBuffer[outIdx] = 0;
        outBuffer[outIdx + 1] = 0;
        outBuffer[outIdx + 2] = 0;
        outBuffer[outIdx + 3] = 0; // Transparent
      } else {
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = 255;
      }
    }
  }

  // Save the crisp PNG
  await sharp(outBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .resize(400, 400)
  .png()
  .toFile(outPng);

  console.log('Saved realistic 3D vault asset to:', outPng);
}

processVaultImage().catch(console.error);
