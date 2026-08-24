const sharp = require('sharp');
const path = require('path');

const size = 600;
const cellSize = size / 10; // 60px per cell

// 1 to 100 coordinate mapping
// Row 0 is top (cells 100 down to 91), Row 9 is bottom (cells 1 to 10)
function getCellCenter(n) {
  const rowFromBottom = Math.floor((n - 1) / 10);
  const row = 9 - rowFromBottom;
  let col;
  if (rowFromBottom % 2 === 0) {
    // Left to right
    col = (n - 1) % 10;
  } else {
    // Right to left
    col = 9 - ((n - 1) % 10);
  }
  return {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
    row,
    col
  };
}

// Ladders and Snakes
const LADDERS = [
  [4, 14], [9, 31], [20, 38], [28, 84], [40, 59], [51, 67], [63, 81], [71, 91]
];

const SNAKES = [
  [17, 7], [54, 34], [62, 19], [64, 60], [87, 24], [93, 73], [95, 75], [99, 78]
];

function buildSnakeBoardSVG() {
  // Cells SVG
  const cells = [];
  const cellColors = ['#e8f5e9', '#fff8e1', '#e3f2fd', '#fce4ec', '#ede7f6'];

  for (let n = 1; n <= 100; n++) {
    const { x, y, row, col } = getCellCenter(n);
    const color = (n === 100) ? '#ffeb3b' : (n === 1 ? '#c8e6c9' : cellColors[(row * 10 + col) % cellColors.length]);
    const x0 = col * cellSize;
    const y0 = row * cellSize;

    cells.push(`
      <rect x="${x0}" y="${y0}" width="${cellSize}" height="${cellSize}" fill="${color}" stroke="#b0bec5" stroke-width="1"/>
      <text x="${x0 + 6}" y="${y0 + 16}" font-family="Outfit, sans-serif" font-size="12" font-weight="900" fill="${n === 100 ? '#b71c1c' : '#37474f'}">${n}</text>
      ${n === 100 ? `<text x="${x}" y="${y + 12}" font-family="Outfit, sans-serif" font-size="15" font-weight="900" text-anchor="middle" fill="#d32f2f">🏆 WIN</text>` : ''}
      ${n === 1 ? `<text x="${x}" y="${y + 12}" font-family="Outfit, sans-serif" font-size="12" font-weight="900" text-anchor="middle" fill="#2e7d32">START</text>` : ''}
    `);
  }

  // Ladders SVG (Golden 3D Ladders with Rungs)
  const laddersSvg = LADDERS.map(([start, end]) => {
    const p1 = getCellCenter(start);
    const p2 = getCellCenter(end);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const perpX = -uy * 8;
    const perpY = ux * 8;

    // Rungs
    const rungs = [];
    const numRungs = Math.floor(len / 16);
    for (let i = 1; i < numRungs; i++) {
      const t = i / numRungs;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      rungs.push(`<line x1="${rx - perpX}" y1="${ry - perpY}" x2="${rx + perpX}" y2="${ry + perpY}" stroke="#e65100" stroke-width="3" stroke-linecap="round"/>`);
    }

    return `
      <g filter="url(#dropShadow)">
        <!-- Left & Right Rails -->
        <line x1="${p1.x - perpX}" y1="${p1.y - perpY}" x2="${p2.x - perpX}" y2="${p2.y - perpY}" stroke="#ff9800" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${p1.x + perpX}" y1="${p1.y + perpY}" x2="${p2.x + perpX}" y2="${p2.y + perpY}" stroke="#ff9800" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${p1.x - perpX}" y1="${p1.y - perpY}" x2="${p2.x - perpX}" y2="${p2.y - perpY}" stroke="#fff3e0" stroke-width="2" stroke-linecap="round"/>
        <line x1="${p1.x + perpX}" y1="${p1.y + perpY}" x2="${p2.x + perpX}" y2="${p2.y + perpY}" stroke="#fff3e0" stroke-width="2" stroke-linecap="round"/>
        ${rungs.join('')}
      </g>
    `;
  }).join('');

  // Snakes SVG (Sleek serpents with curved body and head)
  const snakesSvg = SNAKES.map(([head, tail], idx) => {
    const p1 = getCellCenter(head); // Mouth
    const p2 = getCellCenter(tail); // Tail
    const midX = (p1.x + p2.x) / 2 + ((idx % 2 === 0) ? 35 : -35);
    const midY = (p1.y + p2.y) / 2;

    const snakeColors = ['#d32f2f', '#c2185b', '#7b1fa2', '#e64a19', '#388e3c', '#d32f2f', '#c2185b', '#e64a19'];
    const sColor = snakeColors[idx % snakeColors.length];

    return `
      <g filter="url(#dropShadow)">
        <!-- Snake Body -->
        <path d="M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}" fill="none" stroke="${sColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="6,6" opacity="0.8"/>
        <!-- Snake Head -->
        <circle cx="${p1.x}" cy="${p1.y}" r="8.5" fill="${sColor}" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="${p1.x - 2}" cy="${p1.y - 2}" r="2" fill="#ffffff"/>
        <circle cx="${p1.x + 2}" cy="${p1.y - 2}" r="2" fill="#ffffff"/>
        <circle cx="${p1.x - 2}" cy="${p1.y - 2}" r="1" fill="#000000"/>
        <circle cx="${p1.x + 2}" cy="${p1.y - 2}" r="1" fill="#000000"/>
      </g>
    `;
  }).join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <!-- Background Cells -->
    ${cells.join('')}
    <!-- Ladders -->
    ${laddersSvg}
    <!-- Snakes -->
    ${snakesSvg}
  </svg>`;
}

async function renderBoard() {
  const svg = buildSnakeBoardSVG();
  const outPath = path.join(__dirname, 'assets', 'snake_board_hd.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);
  console.log('Created high-def Snake & Ladders board artwork:', outPath);
}

renderBoard().catch(console.error);
