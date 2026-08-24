const sharp = require('sharp');
const path = require('path');

async function generateCleanLudoBoard() {
  const size = 900;
  const cellSize = size / 15; // 60px per cell

  // Colors matching screenshot
  const RED = '#e51c23';
  const GREEN = '#2e7d32';
  const BLUE = '#1976d2';
  const YELLOW = '#fbc02d';
  const BORDER_COLOR = '#000000';
  const TRACK_BORDER = '#333333';

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer Board Background & Rounded Border -->
    <rect width="${size}" height="${size}" rx="28" ry="28" fill="#ffffff" stroke="#072a6b" stroke-width="8"/>
    
    <!-- 1. RED BASE (Top-Left: 6x6 cells) -->
    <rect x="4" y="4" width="${6 * cellSize}" height="${6 * cellSize}" rx="24" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <rect x="${cellSize * 0.9}" y="${cellSize * 0.9}" width="${cellSize * 4.2}" height="${cellSize * 4.2}" rx="20" fill="#ffffff" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <!-- 4 Red Pockets -->
    <circle cx="${cellSize * 1.95}" cy="${cellSize * 1.95}" r="${cellSize * 0.7}" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 4.05}" cy="${cellSize * 1.95}" r="${cellSize * 0.7}" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 1.95}" cy="${cellSize * 4.05}" r="${cellSize * 0.7}" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 4.05}" cy="${cellSize * 4.05}" r="${cellSize * 0.7}" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="2"/>

    <!-- 2. GREEN BASE (Top-Right: 6x6 cells) -->
    <rect x="${9 * cellSize}" y="4" width="${6 * cellSize - 4}" height="${6 * cellSize}" rx="24" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <rect x="${9.9 * cellSize}" y="${cellSize * 0.9}" width="${cellSize * 4.2}" height="${cellSize * 4.2}" rx="20" fill="#ffffff" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <!-- 4 Green Pockets -->
    <circle cx="${cellSize * 10.95}" cy="${cellSize * 1.95}" r="${cellSize * 0.7}" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 13.05}" cy="${cellSize * 1.95}" r="${cellSize * 0.7}" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 10.95}" cy="${cellSize * 4.05}" r="${cellSize * 0.7}" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 13.05}" cy="${cellSize * 4.05}" r="${cellSize * 0.7}" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="2"/>

    <!-- 3. BLUE BASE (Bottom-Left: 6x6 cells) -->
    <rect x="4" y="${9 * cellSize}" width="${6 * cellSize}" height="${6 * cellSize - 4}" rx="24" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <rect x="${cellSize * 0.9}" y="${cellSize * 9.9}" width="${cellSize * 4.2}" height="${cellSize * 4.2}" rx="20" fill="#ffffff" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <!-- 4 Blue Pockets -->
    <circle cx="${cellSize * 1.95}" cy="${cellSize * 10.95}" r="${cellSize * 0.7}" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 4.05}" cy="${cellSize * 10.95}" r="${cellSize * 0.7}" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 1.95}" cy="${cellSize * 13.05}" r="${cellSize * 0.7}" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 4.05}" cy="${cellSize * 13.05}" r="${cellSize * 0.7}" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="2"/>

    <!-- 4. YELLOW BASE (Bottom-Right: 6x6 cells) -->
    <rect x="${9 * cellSize}" y="${9 * cellSize}" width="${6 * cellSize - 4}" height="${6 * cellSize - 4}" rx="24" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <rect x="${9.9 * cellSize}" y="${cellSize * 9.9}" width="${cellSize * 4.2}" height="${cellSize * 4.2}" rx="20" fill="#ffffff" stroke="${BORDER_COLOR}" stroke-width="3"/>
    <!-- 4 Yellow Pockets -->
    <circle cx="${cellSize * 10.95}" cy="${cellSize * 10.95}" r="${cellSize * 0.7}" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 13.05}" cy="${cellSize * 10.95}" r="${cellSize * 0.7}" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 10.95}" cy="${cellSize * 13.05}" r="${cellSize * 0.7}" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <circle cx="${cellSize * 13.05}" cy="${cellSize * 13.05}" r="${cellSize * 0.7}" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="2"/>

    <!-- TRACK CELLS (Top Arm, Left Arm, Right Arm, Bottom Arm) -->
  `;

  // Draw grid cells for track
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      // Skip 4 corner bases and center 3x3
      const inBase = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
      const inCenter = (r >= 6 && r <= 8 && c >= 6 && c <= 8);

      if (!inBase && !inCenter) {
        let cellColor = '#ffffff';

        // Colored starting cells & Home paths
        // Green
        if (c === 7 && r >= 1 && r <= 5) cellColor = GREEN;
        if (r === 0 && c === 7) cellColor = '#ffffff'; // Green start arrow cell
        if (r === 1 && c === 8) cellColor = GREEN; // Green start

        // Red
        if (r === 7 && c >= 1 && c <= 5) cellColor = RED;
        if (r === 6 && c === 1) cellColor = RED; // Red start

        // Yellow
        if (r === 7 && c >= 9 && c <= 13) cellColor = YELLOW;
        if (r === 8 && c === 13) cellColor = YELLOW; // Yellow start

        // Blue
        if (c === 7 && r >= 9 && r <= 13) cellColor = BLUE;
        if (r === 13 && c === 6) cellColor = BLUE; // Blue start

        const x = c * cellSize;
        const y = r * cellSize;
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${cellColor}" stroke="${TRACK_BORDER}" stroke-width="1.5"/>`;
      }
    }
  }

  // Draw Center Triangles (rows 6-8, cols 6-8)
  const cx1 = 6 * cellSize;
  const cy1 = 6 * cellSize;
  const cx2 = 9 * cellSize;
  const cy2 = 9 * cellSize;
  const midX = 7.5 * cellSize;
  const midY = 7.5 * cellSize;

  svg += `
    <!-- Center Triangles -->
    <!-- Red Left -->
    <polygon points="${cx1},${cy1} ${cx1},${cy2} ${midX},${midY}" fill="${RED}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <!-- Green Top -->
    <polygon points="${cx1},${cy1} ${cx2},${cy1} ${midX},${midY}" fill="${GREEN}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <!-- Yellow Right -->
    <polygon points="${cx2},${cy1} ${cx2},${cy2} ${midX},${midY}" fill="${YELLOW}" stroke="${BORDER_COLOR}" stroke-width="2"/>
    <!-- Blue Bottom -->
    <polygon points="${cx1},${cy2} ${cx2},${cy2} ${midX},${midY}" fill="${BLUE}" stroke="${BORDER_COLOR}" stroke-width="2"/>
  `;

  // Draw 4 Arrows
  // Green Arrow (Row 0, Col 7)
  svg += `<text x="${7.5 * cellSize}" y="${0.75 * cellSize}" font-size="34" font-weight="900" fill="${GREEN}" text-anchor="middle" dominant-baseline="central">↓</text>`;
  // Red Arrow (Row 7, Col 0)
  svg += `<text x="${0.5 * cellSize}" y="${7.5 * cellSize}" font-size="34" font-weight="900" fill="${RED}" text-anchor="middle" dominant-baseline="central">→</text>`;
  // Yellow Arrow (Row 7, Col 14)
  svg += `<text x="${14.5 * cellSize}" y="${7.5 * cellSize}" font-size="34" font-weight="900" fill="${YELLOW}" text-anchor="middle" dominant-baseline="central">←</text>`;
  // Blue Arrow (Row 14, Col 7)
  svg += `<text x="${7.5 * cellSize}" y="${14.25 * cellSize}" font-size="34" font-weight="900" fill="${BLUE}" text-anchor="middle" dominant-baseline="central">↑</text>`;

  // Helper to draw clean Star ⭐
  function drawStar(cx, cy, r) {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * 36 - 90) * (Math.PI / 180);
      const rad = i % 2 === 0 ? r : r * 0.45;
      pts.push(`${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="#222222" stroke-width="2.5"/>`;
  }

  // 4 Safe Stars:
  // 1. Red Arm Star (Row 8, Col 2)
  svg += drawStar(2.5 * cellSize, 8.5 * cellSize, 22);
  // 2. Green Arm Star (Row 2, Col 6)
  svg += drawStar(6.5 * cellSize, 2.5 * cellSize, 22);
  // 3. Yellow Arm Star (Row 6, Col 12)
  svg += drawStar(12.5 * cellSize, 6.5 * cellSize, 22);
  // 4. Blue Arm Star (Row 12, Col 8)
  svg += drawStar(8.5 * cellSize, 12.5 * cellSize, 22);

  svg += `</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, 'assets', 'ludo_board_clean.png'));

  console.log('Clean Ludo Board generated successfully!');
}

generateCleanLudoBoard().catch(console.error);
