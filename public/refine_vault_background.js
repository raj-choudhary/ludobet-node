const sharp = require('sharp');
const path = require('path');

async function refineVaultBackground() {
  const inputJpg = 'C:/Users/MYPC/.gemini/antigravity-ide/brain/206a2c0d-fb69-4040-8855-56c34b327eee/wallet_3d_render_1787073633635.jpg';
  const outPng = path.join(__dirname, 'assets', 'wallet_vault_3d.png');

  const size = 600;
  const image = sharp(inputJpg).resize(size, size, { fit: 'cover' });
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

      // Detect the grey & white checkerboard background pixels:
      // Neutral color (|r-g| < 6, |g-b| < 6) and brightness (r > 160)
      // And outside the inner vault opening (x < 150 || x > 540 || y < 100 || (x > 350 && y < 200))
      const isNeutral = Math.abs(r - g) <= 5 && Math.abs(g - b) <= 5 && Math.abs(r - b) <= 5;
      const isGreyWhite = r > 165 && g > 165 && b > 165;
      
      // Calculate distance from center
      const dx = x - size / 2;
      const dy = y - size / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > (size / 2 - 12)) {
        // Outside circle
        outBuffer[outIdx] = 0;
        outBuffer[outIdx + 1] = 0;
        outBuffer[outIdx + 2] = 0;
        outBuffer[outIdx + 3] = 0; // transparent outside circle
      } else if (isNeutral && isGreyWhite && (x < 170 || x > 520 || y < 100 || (x > 330 && y < 180))) {
        // Replace checkerboard with dark luxury sapphire blue matching the VIP card!
        outBuffer[outIdx] = 8;
        outBuffer[outIdx + 1] = 27;
        outBuffer[outIdx + 2] = 65;
        outBuffer[outIdx + 3] = 255;
      } else {
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = 255;
      }
    }
  }

  // Overlay gold ring
  const overlayRingSvg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff9c4"/>
        <stop offset="25%" stop-color="#fbc02d"/>
        <stop offset="50%" stop-color="#ffd54f"/>
        <stop offset="75%" stop-color="#f57f17"/>
        <stop offset="100%" stop-color="#ff6f00"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ffca28" flood-opacity="0.8"/>
      </filter>
    </defs>
    <!-- Outer Gold Ring -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 12}" fill="none" stroke="url(#goldRim)" stroke-width="12" filter="url(#glow)"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 19}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
  </svg>`;

  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .composite([{ input: Buffer.from(overlayRingSvg), blend: 'over' }])
  .png()
  .toFile(outPng);

  console.log('Saved seamless luxury 3D vault emblem to:', outPng);
}

refineVaultBackground().catch(console.error);
