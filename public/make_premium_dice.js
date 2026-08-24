const sharp = require('sharp');
const path = require('path');

async function generatePremiumLudoDice() {
  const outDir = path.join(__dirname, 'assets');
  const size = 160;

  // Dot patterns for values 1 to 6 (coordinates on 160x160 canvas, center=80)
  // Grid: left=42, center=80, right=118; top=42, center=80, bottom=118
  const dotCoords = {
    1: [[80, 80]],
    2: [[118, 42], [42, 118]],
    3: [[118, 42], [80, 80], [42, 118]],
    4: [[42, 42], [118, 42], [42, 118], [118, 118]],
    5: [[42, 42], [118, 42], [80, 80], [42, 118], [118, 118]],
    6: [[42, 42], [118, 42], [42, 80], [118, 80], [42, 118], [118, 118]]
  };

  for (let val = 1; val <= 6; val++) {
    const dots = dotCoords[val];
    let dotsSvg = dots.map(([cx, cy]) => `
      <circle cx="${cx}" cy="${cy}" r="13" fill="url(#pipGrad)" filter="url(#pipShadow)"/>
      <circle cx="${cx - 3}" cy="${cy - 3}" r="3.5" fill="#ffffff" opacity="0.4"/>
    `).join('');

    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dice Outer Drop Shadow -->
        <filter id="diceShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
        </filter>

        <!-- Pip Inner Shadow -->
        <filter id="pipShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>

        <!-- Dice 3D Body Gradient (Smooth Glossy Porcelain White) -->
        <linearGradient id="diceBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#f8fafc"/>
          <stop offset="75%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>

        <!-- Dice Border Bevel Gradient -->
        <linearGradient id="diceBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>

        <!-- Deep Recessed Pip Gradient -->
        <radialGradient id="pipGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="60%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>

      <!-- Main Dice Rounded Body -->
      <rect x="8" y="8" width="144" height="144" rx="30" ry="30" 
            fill="url(#diceBodyGrad)" 
            stroke="url(#diceBorderGrad)" 
            stroke-width="3" 
            filter="url(#diceShadow)"/>

      <!-- Top Inner Specular Highlight Arc -->
      <path d="M 28 16 Q 80 12 132 16" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
      <rect x="14" y="14" width="132" height="66" rx="24" fill="#ffffff" opacity="0.15"/>

      <!-- Pips / Dots -->
      ${dotsSvg}
    </svg>`;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(outDir, `dice_${val}.png`));
  }

  console.log('Premium Ludo King Style 3D Dice generated successfully!');
}

generatePremiumLudoDice().catch(console.error);
