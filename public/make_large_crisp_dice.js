const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

const outDir = path.join(__dirname, 'assets');
const size = 160;

// Standard clean Ludo King style dice faces with bold dots and glossy 3D bevels
// Tightly fitted to fill 85% of canvas (136x136 box inside 160x160 canvas)
function getCleanDiceSVG(val, rotation = 0) {
  // Dot coordinates for 136x136 dice body starting at (12, 12)
  // Center is 80. Left column = 42, Right column = 118, Top row = 42, Bottom row = 118
  const dots = {
    1: [[80, 80]],
    2: [[116, 44], [44, 116]],
    3: [[116, 44], [80, 80], [44, 116]],
    4: [[44, 44], [116, 44], [44, 116], [116, 116]],
    5: [[44, 44], [116, 44], [80, 80], [44, 116], [116, 116]],
    6: [[44, 44], [116, 44], [44, 80], [116, 80], [44, 116], [116, 116]]
  }[val] || [[80, 80]];

  const pipsSvg = dots.map(([cx, cy]) => `
    <circle cx="${cx}" cy="${cy}" r="14.5" fill="url(#pipGrad)" filter="url(#pipDepth)"/>
    <circle cx="${cx - 3.5}" cy="${cy - 3.5}" r="3.5" fill="#ffffff" opacity="0.75"/>
  `).join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep Ground Contact Shadow -->
      <filter id="boxShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.45"/>
      </filter>

      <!-- Pip Inset Depth -->
      <filter id="pipDepth" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.8"/>
      </filter>

      <!-- High-End Glossy White Porcelain Body -->
      <linearGradient id="bodyGrad" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#fdfdfd"/>
        <stop offset="70%" stop-color="#edf2f7"/>
        <stop offset="100%" stop-color="#cbd5e1"/>
      </linearGradient>

      <!-- Beveled Border -->
      <linearGradient id="bevelBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="40%" stop-color="#e2e8f0"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>

      <!-- Glossy Black Pip Gradient -->
      <radialGradient id="pipGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
    </defs>

    <g transform="rotate(${rotation} ${size/2} ${size/2})">
      <!-- Main Dice Block -->
      <rect x="14" y="14" width="132" height="132" rx="28" ry="28" 
            fill="url(#bodyGrad)" 
            stroke="url(#bevelBorder)" 
            stroke-width="3" 
            filter="url(#boxShadow)"/>

      <!-- Top Curvature Specular Highlight Glass Shine -->
      <path d="M 32 19 Q 80 15 128 19" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.95"/>
      <rect x="20" y="20" width="120" height="56" rx="20" fill="#ffffff" opacity="0.22"/>

      <!-- Inset Pips -->
      ${pipsSvg}
    </g>
  </svg>`;
}

async function createGIF(svgFrames, delay = 40) {
  const gif = GIFEncoder();
  for (const svg of svgFrames) {
    const { data } = await sharp(Buffer.from(svg))
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const palette = quantize(data, 256, { format: 'rgba4444' });
    const index = applyPalette(data, palette, 'rgba4444');

    gif.writeFrame(index, size, size, {
      palette,
      delay,
      transparent: true,
      transparentIndex: 0,
      dispose: 2
    });
  }
  gif.finish();
  return Buffer.from(gif.bytes());
}

async function buildLargeCrispLudoDice() {
  console.log('Generating Large, Beautiful, Ultra-Crisp Ludo King Style Dice...');

  // 1. Generate Static PNGs 1 to 6 (Tightly fitted, perfectly centered)
  for (let val = 1; val <= 6; val++) {
    const svg = getCleanDiceSVG(val, 0);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(outDir, `dice_${val}.png`));
    console.log(`Created: assets/dice_${val}.png`);
  }

  // 2. Generate Smooth High-Velocity 3D Tumbling GIFs (1 to 6)
  const numFrames = 16;
  for (let finalVal = 1; finalVal <= 6; finalVal++) {
    const frames = [];
    for (let f = 0; f < numFrames; f++) {
      const progress = f / (numFrames - 1);
      // Fast spin during first 70%, deceleration into final value on last 30%
      let tempVal;
      let angle;

      if (progress < 0.75) {
        // Random rapid face shuffle during rolling
        tempVal = ((f * 3 + finalVal) % 6) + 1;
        angle = (f * 45) % 360;
      } else {
        // Snap smoothly into final value
        tempVal = finalVal;
        const settleProgress = (progress - 0.75) / 0.25;
        angle = (1 - settleProgress) * 20;
      }

      frames.push(getCleanDiceSVG(tempVal, angle));
    }

    const gifBuffer = await createGIF(frames, 45);
    fs.writeFileSync(path.join(outDir, `dice_roll_${finalVal}.gif`), gifBuffer);
    console.log(`Created: assets/dice_roll_${finalVal}.gif`);
  }

  console.log('All Ludo King Style Dice generated successfully!');
}

buildLargeCrispLudoDice().catch(console.error);
