const sharp = require('sharp');
const path = require('path');

async function refineVaultFlawless() {
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

      const dx = x - size / 2;
      const dy = y - size / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if it's neutral grey/white (checkerboard pattern)
      const isNeutral = Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15;
      const isChecker = isNeutral && (r > 140);

      // Vault interior has rich warm gold colors (r >> b, g >> b, saturation high)
      // The only checkerboard is on background:
      const isNotGoldOrMoney = (r - b < 30) || (g - b < 15);

      if (dist > (size / 2 - 12)) {
        // Outside circle => transparent
        outBuffer[outIdx] = 0;
        outBuffer[outIdx + 1] = 0;
        outBuffer[outIdx + 2] = 0;
        outBuffer[outIdx + 3] = 0;
      } else if (isChecker && isNotGoldOrMoney) {
        // Replace with deep luxury sapphire blue with radial gradient glow
        const glowFactor = Math.max(0, 1 - dist / (size / 2));
        outBuffer[outIdx] = Math.round(8 + 12 * glowFactor);
        outBuffer[outIdx + 1] = Math.round(24 + 20 * glowFactor);
        outBuffer[outIdx + 2] = Math.round(64 + 40 * glowFactor);
        outBuffer[outIdx + 3] = 255;
      } else {
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = 255;
      }
    }
  }

  // Overlay gold ring and specular sparkles
  const overlayRingSvg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="15%" stop-color="#fff59d"/>
        <stop offset="40%" stop-color="#ffca28"/>
        <stop offset="70%" stop-color="#ff8f00"/>
        <stop offset="90%" stop-color="#ffa000"/>
        <stop offset="100%" stop-color="#fff9c4"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ffca28" flood-opacity="0.85"/>
      </filter>
    </defs>
    <!-- Outer Gold Ring -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 12}" fill="none" stroke="url(#goldRim)" stroke-width="14" filter="url(#glow)"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 20}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
    
    <!-- Top-Left Sparkle Glint -->
    <polygon points="120,70 123,85 120,100 117,85" fill="#ffffff"/>
    <polygon points="105,85 120,88 135,85 120,82" fill="#ffffff"/>
    <circle cx="120" cy="85" r="4" fill="#ffffff"/>
  </svg>`;

  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .composite([{ input: Buffer.from(overlayRingSvg), blend: 'over' }])
  .png()
  .toFile(outPng);

  console.log('Saved 100% flawless luxury 3D vault emblem to:', outPng);
}

refineVaultFlawless().catch(console.error);
