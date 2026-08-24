const sharp = require('sharp');
const path = require('path');

async function createFlawless3DPawns() {
  const outDir = path.join(__dirname, 'assets');

  function getPawnSVG(mainColor, lightColor, darkColor, shadowColor) {
    return `<svg width="120" height="136" viewBox="0 0 120 136" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Ground Drop Shadow -->
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
          <stop offset="70%" stop-color="#000000" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>

        <!-- Base Ring Gradient -->
        <linearGradient id="baseRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4a1a0c"/>
          <stop offset="50%" stop-color="#2a0d05"/>
          <stop offset="100%" stop-color="#140602"/>
        </linearGradient>

        <!-- Base Inner White Ring -->
        <linearGradient id="whiteRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#d0d0d0"/>
        </linearGradient>

        <!-- Body 3D Cone Gradient -->
        <radialGradient id="bodyGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${lightColor}"/>
          <stop offset="45%" stop-color="${mainColor}"/>
          <stop offset="85%" stop-color="${darkColor}"/>
          <stop offset="100%" stop-color="${shadowColor}"/>
        </radialGradient>

        <!-- Head 3D Sphere Gradient -->
        <radialGradient id="headGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
          <stop offset="25%" stop-color="${lightColor}"/>
          <stop offset="60%" stop-color="${mainColor}"/>
          <stop offset="90%" stop-color="${darkColor}"/>
          <stop offset="100%" stop-color="${shadowColor}"/>
        </radialGradient>

        <!-- Specular Highlight for Head -->
        <radialGradient id="headSpecular" cx="30%" cy="25%" r="30%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="60%" stop-color="#ffffff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- 1. Ground Drop Shadow -->
      <ellipse cx="60" cy="126" rx="42" ry="8" fill="url(#groundShadow)"/>

      <!-- 2. Outer Base Rim (Dark Ring) -->
      <ellipse cx="60" cy="120" rx="40" ry="12" fill="url(#baseRimGrad)" stroke="#110502" stroke-width="1.5"/>

      <!-- 3. Inner White/Silver Base Ring -->
      <ellipse cx="60" cy="116" rx="34" ry="9" fill="url(#whiteRingGrad)" stroke="#90a4ae" stroke-width="1.2"/>

      <!-- 4. Pawn Body (Classic Tapered Cone) -->
      <path d="M 45 56 
               Q 48 85 30 110 
               C 30 114 90 114 90 110 
               Q 72 85 75 56 
               Z" 
            fill="url(#bodyGrad)" stroke="${darkColor}" stroke-width="1"/>

      <!-- Body Specular Highlight -->
      <path d="M 47 62 Q 49 85 40 108" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>

      <!-- 5. Head (Top Ball) -->
      <circle cx="60" cy="42" r="26" fill="url(#headGrad)" stroke="${darkColor}" stroke-width="1.2"/>

      <!-- Specular Highlight -->
      <ellipse cx="50" cy="33" rx="9" ry="6" fill="url(#headSpecular)" transform="rotate(-20 50 33)"/>
      <circle cx="47" cy="30" r="3" fill="#ffffff" opacity="0.95"/>
    </svg>`;
  }

  // 1. Blue Pawn
  const blueSVG = getPawnSVG('#1e88e5', '#90caf9', '#1565c0', '#0d47a1');
  await sharp(Buffer.from(blueSVG)).png().toFile(path.join(outDir, 'pawn_3d_blue.png'));

  // 2. Green Pawn
  const greenSVG = getPawnSVG('#43a047', '#a5d6a7', '#2e7d32', '#1b5e20');
  await sharp(Buffer.from(greenSVG)).png().toFile(path.join(outDir, 'pawn_3d_green.png'));

  // 3. Red Pawn
  const redSVG = getPawnSVG('#e53935', '#ef9a9a', '#c62828', '#b71c1c');
  await sharp(Buffer.from(redSVG)).png().toFile(path.join(outDir, 'pawn_3d_red.png'));

  // 4. Yellow Pawn
  const yellowSVG = getPawnSVG('#fbc02d', '#fff59d', '#f57f17', '#e65100');
  await sharp(Buffer.from(yellowSVG)).png().toFile(path.join(outDir, 'pawn_3d_yellow.png'));

  console.log('Classic Proportional 3D Pawns Generated!');
}

createFlawless3DPawns().catch(console.error);
