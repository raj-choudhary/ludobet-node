const sharp = require('sharp');
const path = require('path');

const size = 640;
const cellSize = size / 10; // 64px per cell

function getCellCenter(n) {
  const rowFromBottom = Math.floor((n - 1) / 10);
  const row = 9 - rowFromBottom;
  let col;
  if (rowFromBottom % 2 === 0) {
    col = (n - 1) % 10;
  } else {
    col = 9 - ((n - 1) % 10);
  }
  return {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
    row,
    col
  };
}

// Ladders: [Start, End]
const LADDERS = [
  [4, 14],
  [9, 31],
  [20, 38],
  [28, 84],
  [40, 59],
  [51, 67],
  [63, 81],
  [71, 91]
];

// Snakes: [Head (Mouth), Tail (Tip)]
const SNAKES = [
  { head: 17, tail: 7, color: '#e53935', belly: '#ffcdd2', curve: -40 },
  { head: 54, tail: 34, color: '#2e7d32', belly: '#c8e6c9', curve: 45 },
  { head: 62, tail: 19, color: '#7b1fa2', belly: '#e1bee7', curve: -50 },
  { head: 64, tail: 60, color: '#e65100', belly: '#ffe0b2', curve: 30 },
  { head: 87, tail: 24, color: '#1565c0', belly: '#bbdefb', curve: 60 },
  { head: 93, tail: 73, color: '#c2185b', belly: '#f8bbd0', curve: -40 },
  { head: 95, tail: 75, color: '#2e7d32', belly: '#dcedc8', curve: 35 },
  { head: 99, tail: 78, color: '#d50000', belly: '#ffcdd2', curve: -50 }
];

function buildRealisticSnakeBoardSVG() {
  // 1. Grid Cells with alternating pastel tiles
  const cells = [];
  const palette = ['#e8f5e9', '#fff8e1', '#e3f2fd', '#fce4ec', '#ede7f6'];

  for (let n = 1; n <= 100; n++) {
    const { x, y, row, col } = getCellCenter(n);
    const isWin = n === 100;
    const isStart = n === 1;
    const bg = isWin ? 'url(#winGrad)' : (isStart ? 'url(#startGrad)' : palette[(row * 7 + col) % palette.length]);
    const x0 = col * cellSize;
    const y0 = row * cellSize;

    cells.push(`
      <rect x="${x0}" y="${y0}" width="${cellSize}" height="${cellSize}" fill="${bg}" stroke="#cfd8dc" stroke-width="1.2"/>
      <rect x="${x0 + 2}" y="${y0 + 2}" width="${cellSize - 4}" height="${cellSize - 4}" rx="4" fill="#ffffff" opacity="0.4"/>
      <text x="${x0 + 7}" y="${y0 + 17}" font-family="Outfit, Arial, sans-serif" font-size="13" font-weight="900" fill="${isWin ? '#b71c1c' : '#263238'}">${n}</text>
      ${isWin ? `<text x="${x}" y="${y + 14}" font-family="Outfit, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#b71c1c">🏆 WIN</text>` : ''}
      ${isStart ? `<text x="${x}" y="${y + 14}" font-family="Outfit, sans-serif" font-size="12" font-weight="900" text-anchor="middle" fill="#1b5e20">START</text>` : ''}
    `);
  }

  // 2. Realistic 3D Wooden Ladders with Textured Rungs & Drop Shadow
  const laddersSvg = LADDERS.map(([start, end]) => {
    const p1 = getCellCenter(start);
    const p2 = getCellCenter(end);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const perpX = -uy * 9;
    const perpY = ux * 9;

    const rungs = [];
    const numRungs = Math.floor(len / 18);
    for (let i = 1; i < numRungs; i++) {
      const t = i / numRungs;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      rungs.push(`
        <line x1="${rx - perpX}" y1="${ry - perpY}" x2="${rx + perpX}" y2="${ry + perpY}" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${rx - perpX}" y1="${ry - perpY - 1}" x2="${rx + perpX}" y2="${ry + perpY - 1}" stroke="#ffb74d" stroke-width="2.2" stroke-linecap="round"/>
      `);
    }

    return `
      <g filter="url(#ladderShadow)">
        <!-- Main Rails -->
        <line x1="${p1.x - perpX}" y1="${p1.y - perpY}" x2="${p2.x - perpX}" y2="${p2.y - perpY}" stroke="#4e342e" stroke-width="6" stroke-linecap="round"/>
        <line x1="${p1.x + perpX}" y1="${p1.y + perpY}" x2="${p2.x + perpX}" y2="${p2.y + perpY}" stroke="#4e342e" stroke-width="6" stroke-linecap="round"/>
        
        <!-- Rail Wood Highlights -->
        <line x1="${p1.x - perpX}" y1="${p1.y - perpY}" x2="${p2.x - perpX}" y2="${p2.y - perpY}" stroke="#ffa726" stroke-width="3" stroke-linecap="round"/>
        <line x1="${p1.x + perpX}" y1="${p1.y + perpY}" x2="${p2.x + perpX}" y2="${p2.y + perpY}" stroke="#ffa726" stroke-width="3" stroke-linecap="round"/>
        
        <!-- Rungs -->
        ${rungs.join('')}
      </g>
    `;
  }).join('');

  // 3. Realistic Illustrated Serpents (Snakes)
  // With detailed Cobra/Viper head, sinister eyes, forked red tongue, scaly body and pointed tail!
  const snakesSvg = SNAKES.map(s => {
    const p1 = getCellCenter(s.head); // Head
    const p2 = getCellCenter(s.tail); // Tail tip

    const midX1 = p1.x * 0.65 + p2.x * 0.35 + s.curve;
    const midY1 = p1.y * 0.65 + p2.y * 0.35;
    const midX2 = p1.x * 0.35 + p2.x * 0.65 - s.curve * 0.6;
    const midY2 = p1.y * 0.35 + p2.y * 0.65;

    // Angle of head
    const headAngle = Math.atan2(midY1 - p1.y, midX1 - p1.x) * (180 / Math.PI) + 180;

    return `
      <g filter="url(#snakeShadow)">
        <!-- Scaly Underbelly Layer -->
        <path d="M ${p1.x} ${p1.y} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${p2.x} ${p2.y}" 
              fill="none" stroke="${s.belly}" stroke-width="16" stroke-linecap="round" opacity="0.9"/>

        <!-- Main Serpent Muscular Body -->
        <path d="M ${p1.x} ${p1.y} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${p2.x} ${p2.y}" 
              fill="none" stroke="${s.color}" stroke-width="13" stroke-linecap="round"/>

        <!-- Diamond Cross-Hatch Scale Pattern Texture -->
        <path d="M ${p1.x} ${p1.y} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${p2.x} ${p2.y}" 
              fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-dasharray="5,6" opacity="0.85"/>
        
        <path d="M ${p1.x} ${p1.y} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${p2.x} ${p2.y}" 
              fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-dasharray="2,9" opacity="0.6"/>

        <!-- Tapered Sharp Tail Tip -->
        <circle cx="${p2.x}" cy="${p2.y}" r="3" fill="${s.color}"/>

        <!-- Realistic Viper / Cobra Serpent Head -->
        <g transform="translate(${p1.x}, ${p1.y}) rotate(${headAngle})">
          <!-- Forked Red Tongue -->
          <path d="M 12 0 L 22 -3 M 12 0 L 22 3 M 6 0 L 14 0" stroke="#d50000" stroke-width="2" stroke-linecap="round"/>

          <!-- Head Shape (Diamond Cobra Hood) -->
          <path d="M -8 -11 C 0 -13, 10 -9, 13 0 C 10 9, 0 13, -8 11 C -12 6, -12 -6, -8 -11 Z" 
                fill="${s.color}" stroke="#ffffff" stroke-width="1.8" filter="url(#headShadow)"/>

          <!-- Brow Ridges -->
          <path d="M 0 -7 Q 6 -5 8 -1" stroke="#000000" stroke-width="1.5" fill="none" opacity="0.6"/>
          <path d="M 0 7 Q 6 5 8 1" stroke="#000000" stroke-width="1.5" fill="none" opacity="0.6"/>

          <!-- Sinister Glowing Yellow Eyes with Slit Pupils -->
          <ellipse cx="4" cy="-6" rx="3" ry="2.2" fill="#ffeb3b" stroke="#212121" stroke-width="1"/>
          <line x1="4" y1="-8" x2="4" y2="-4" stroke="#000000" stroke-width="1.6"/>

          <ellipse cx="4" cy="6" rx="3" ry="2.2" fill="#ffeb3b" stroke="#212121" stroke-width="1"/>
          <line x1="4" y1="4" x2="4" y2="8" stroke="#000000" stroke-width="1.6"/>

          <!-- Snout & Nostril Pits -->
          <circle cx="9" cy="-2" r="0.9" fill="#000000"/>
          <circle cx="9" cy="2" r="0.9" fill="#000000"/>
        </g>
      </g>
    `;
  }).join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Drop Shadow for Ladders -->
      <filter id="ladderShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="5" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
      </filter>

      <!-- Deep 3D Shadow for Serpents -->
      <filter id="snakeShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="2" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.5"/>
      </filter>

      <filter id="headShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.6"/>
      </filter>

      <!-- Gradients -->
      <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff59d"/>
        <stop offset="100%" stop-color="#ffd54f"/>
      </linearGradient>

      <linearGradient id="startGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8f5e9"/>
        <stop offset="100%" stop-color="#a5d6a7"/>
      </linearGradient>
    </defs>

    <!-- 1. Background Grid -->
    ${cells.join('')}

    <!-- 2. Realistic 3D Ladders -->
    ${laddersSvg}

    <!-- 3. Illustrated Realistic Serpents -->
    ${snakesSvg}
  </svg>`;
}

async function generateBoard() {
  const svg = buildRealisticSnakeBoardSVG();
  const outPath = path.join(__dirname, 'assets', 'snake_board_hd.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);
  console.log('Successfully generated realistic Snake & Ladders board artwork:', outPath);
}

generateBoard().catch(console.error);
