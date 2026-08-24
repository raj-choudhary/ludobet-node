const sharp = require('sharp');
const path = require('path');

async function makeVaultEmblem() {
  const inputJpg = 'C:/Users/MYPC/.gemini/antigravity-ide/brain/206a2c0d-fb69-4040-8855-56c34b327eee/wallet_3d_render_1787073633635.jpg';
  const outPng = path.join(__dirname, 'assets', 'wallet_vault_3d.png');

  // Let's create a transparent PNG with a sophisticated circular/squircle mask that crops the vault cleanly:
  // Vault center is around (500, 500) with radius 440
  const size = 600;

  // 1. Resize input vault
  const resizedVault = await sharp(inputJpg)
    .resize(size, size, { fit: 'cover' })
    .toBuffer();

  // 2. Create an SVG circular cutout mask with soft gold glowing border
  const maskSvg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="edgeFade" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="92%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Soft circular mask -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="url(#edgeFade)"/>
  </svg>`;

  const maskBuffer = await sharp(Buffer.from(maskSvg)).png().toBuffer();

  // 3. Apply mask to the vault image
  const maskedVault = await sharp(resizedVault)
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Wrap with a luxury glowing golden ring border
  const overlayRingSvg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff9c4"/>
        <stop offset="30%" stop-color="#ffca28"/>
        <stop offset="70%" stop-color="#ff8f00"/>
        <stop offset="100%" stop-color="#ffd54f"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#ffca28" flood-opacity="0.6"/>
      </filter>
    </defs>
    <!-- Outer Gold Ring -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 12}" fill="none" stroke="url(#goldRim)" stroke-width="10" filter="url(#glow)"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 18}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
  </svg>`;

  const finalEmblem = await sharp(maskedVault)
    .composite([{ input: Buffer.from(overlayRingSvg), blend: 'over' }])
    .png()
    .toFile(outPng);

  console.log('Created luxury 3D vault emblem PNG:', outPng);
}

makeVaultEmblem().catch(console.error);
