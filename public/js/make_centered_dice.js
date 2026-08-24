const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

// 3D Math Helper Functions
function rotateX(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [p[0], p[1] * cos - p[2] * sin, p[1] * sin + p[2] * cos];
}

function rotateY(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [p[0] * cos + p[2] * sin, p[1], -p[0] * sin + p[2] * cos];
}

function rotateZ(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [p[0] * cos - p[1] * sin, p[0] * sin + p[1] * cos, p[2]];
}

function project(p, size, fov = 3.6) {
  // Exact geometric center projection with zero drift
  const scale = (size * 0.42) / (fov - p[2]);
  return [
    size / 2 + p[0] * scale,
    size / 2 - p[1] * scale
  ];
}

// 8 vertices of a unit cube
const VERTICES = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
];

// 6 faces with vertex indices, normal, and pip pattern
const FACES = [
  { id: 1, v: [4, 5, 6, 7], normal: [0, 0, 1], u: [1, 0, 0], vAxis: [0, 1, 0] },
  { id: 2, v: [1, 0, 3, 2], normal: [0, 0, -1], u: [-1, 0, 0], vAxis: [0, 1, 0] },
  { id: 3, v: [0, 4, 7, 3], normal: [-1, 0, 0], u: [0, 0, 1], vAxis: [0, 1, 0] },
  { id: 4, v: [5, 1, 2, 6], normal: [1, 0, 0], u: [0, 0, -1], vAxis: [0, 1, 0] },
  { id: 5, v: [7, 6, 2, 3], normal: [0, 1, 0], u: [1, 0, 0], vAxis: [0, 0, -1] },
  { id: 6, v: [0, 1, 5, 4], normal: [0, -1, 0], u: [1, 0, 0], vAxis: [0, 0, 1] }
];

const PIP_PATTERNS = {
  1: [[0, 0]],
  2: [[-0.45, -0.45], [0.45, 0.45]],
  3: [[-0.45, -0.45], [0, 0], [0.45, 0.45]],
  4: [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]],
  5: [[-0.45, -0.45], [0.45, -0.45], [0, 0], [-0.45, 0.45], [0.45, 0.45]],
  6: [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0], [0.45, 0], [-0.45, 0.45], [0.45, 0.45]]
};

const LIGHT_DIR = [0.35, 0.65, 0.67];

function render3DDiceSVG(rotX, rotY, rotZ, size = 120) {
  // Transform vertices strictly around center [0,0,0]
  const transVerts = VERTICES.map(v => {
    let p = rotateX(v, rotX);
    p = rotateY(p, rotY);
    p = rotateZ(p, rotZ);
    return p;
  });

  const projVerts = transVerts.map(v => project(v, size));

  const faceList = FACES.map(f => {
    let norm = rotateX(f.normal, rotX);
    norm = rotateY(norm, rotY);
    norm = rotateZ(norm, rotZ);

    let uVec = rotateX(f.u, rotX);
    uVec = rotateY(uVec, rotY);
    uVec = rotateZ(uVec, rotZ);

    let vVec = rotateX(f.vAxis, rotX);
    vVec = rotateY(vVec, rotY);
    vVec = rotateZ(vVec, rotZ);

    const center = [
      (transVerts[f.v[0]][0] + transVerts[f.v[1]][0] + transVerts[f.v[2]][0] + transVerts[f.v[3]][0]) / 4,
      (transVerts[f.v[0]][1] + transVerts[f.v[1]][1] + transVerts[f.v[2]][1] + transVerts[f.v[3]][1]) / 4,
      (transVerts[f.v[0]][2] + transVerts[f.v[1]][2] + transVerts[f.v[2]][2] + transVerts[f.v[3]][2]) / 4
    ];

    const dotL = Math.max(0.18, norm[0] * LIGHT_DIR[0] + norm[1] * LIGHT_DIR[1] + norm[2] * LIGHT_DIR[2]);

    return {
      face: f,
      normal: norm,
      u: uVec,
      vAxis: vVec,
      center,
      dotL,
      avgZ: center[2],
      isVisible: norm[2] > -0.05
    };
  }).filter(f => f.isVisible).sort((a, b) => a.avgZ - b.avgZ);

  let svgFaces = '';

  // Perfectly centered subtle ground drop shadow
  svgFaces += `<ellipse cx="${size/2}" cy="${size * 0.90}" rx="${size * 0.36}" ry="${size * 0.09}" fill="rgba(15,23,42,0.35)"/>`;

  faceList.forEach(item => {
    const pts = item.face.v.map(idx => `${projVerts[idx][0].toFixed(1)},${projVerts[idx][1].toFixed(1)}`).join(' ');
    
    const brightness = Math.floor(190 + item.dotL * 65);
    const fillHex = `rgb(${brightness}, ${brightness + 2}, ${brightness + 6})`;
    const strokeHex = `rgb(${Math.floor(brightness * 0.70)}, ${Math.floor(brightness * 0.70)}, ${Math.floor(brightness * 0.74)})`;

    svgFaces += `<polygon points="${pts}" fill="${fillHex}" stroke="${strokeHex}" stroke-width="2.5" stroke-linejoin="round"/>`;

    // Pips
    const pips = PIP_PATTERNS[item.face.id];
    pips.forEach(([pu, pv]) => {
      const pipPos = [
        item.center[0] + item.u[0] * pu * 1.35 + item.vAxis[0] * pv * 1.35,
        item.center[1] + item.u[1] * pu * 1.35 + item.vAxis[1] * pv * 1.35,
        item.center[2] + item.u[2] * pu * 1.35 + item.vAxis[2] * pv * 1.35
      ];
      const projPip = project(pipPos, size);
      const pipRadius = Math.max(3.2, (size * 0.045) / (3.6 - pipPos[2]));

      svgFaces += `<circle cx="${projPip[0].toFixed(1)}" cy="${projPip[1].toFixed(1)}" r="${pipRadius.toFixed(1)}" fill="#020617"/>`;
      svgFaces += `<circle cx="${(projPip[0] - 1.1).toFixed(1)}" cy="${(projPip[1] - 1.1).toFixed(1)}" r="${(pipRadius * 0.32).toFixed(1)}" fill="#ffffff" opacity="0.65"/>`;
    });
  });

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${svgFaces}
  </svg>`;
}

async function createGIFFromSVGFrames(svgFrames, width, height, delay = 40) {
  const gif = GIFEncoder();

  for (const svg of svgFrames) {
    const { data } = await sharp(Buffer.from(svg))
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const palette = quantize(data, 256, { format: 'rgba4444' });
    const index = applyPalette(data, palette, 'rgba4444');

    gif.writeFrame(index, width, height, {
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

async function buildFlawlessCenteredDice() {
  const outDir = path.join(__dirname, 'assets');
  const size = 120;
  const numFrames = 18;

  console.log('Generating 100% Centered Flawless Dice Assets (GIFs + PNGs)...');

  // Exact resting angles for each face (clean slight 3D perspective angle)
  const TARGET_ROTATIONS = {
    1: [-0.22, 0.32, 0],
    2: [-0.22, Math.PI + 0.32, 0],
    3: [-0.22, -Math.PI / 2 + 0.32, 0],
    4: [-0.22, Math.PI / 2 + 0.32, 0],
    5: [-Math.PI / 2 - 0.22, 0.32, 0],
    6: [Math.PI / 2 - 0.22, 0.32, 0]
  };

  for (let targetNum = 1; targetNum <= 6; targetNum++) {
    const targetRot = TARGET_ROTATIONS[targetNum];
    const svgFrames = [];

    for (let f = 0; f < numFrames; f++) {
      const progress = f / (numFrames - 1);
      const ease = 1 - Math.pow(1 - progress, 2.5);

      // Continuous 3D tumble that decelerates and lands on exact targetRot
      const rotX = (1 - ease) * (Math.PI * 4) + targetRot[0];
      const rotY = (1 - ease) * (Math.PI * 6) + targetRot[1];
      const rotZ = (1 - ease) * (Math.PI * 2.5) + targetRot[2];

      const svg = render3DDiceSVG(rotX, rotY, rotZ, size);
      svgFrames.push(svg);
    }

    // Save Animated GIF
    const gifBuffer = await createGIFFromSVGFrames(svgFrames, size, size, 40);
    fs.writeFileSync(path.join(outDir, `dice_roll_${targetNum}.gif`), gifBuffer);

    // Save EXACT matching static resting PNG (frame 18)
    const finalSVG = svgFrames[numFrames - 1];
    await sharp(Buffer.from(finalSVG))
      .png()
      .toFile(path.join(outDir, `dice_${targetNum}.png`));

    console.log(`Generated centered dice_${targetNum}.png and dice_roll_${targetNum}.gif`);
  }

  console.log('All centered dice assets successfully generated!');
}

buildFlawlessCenteredDice().catch(console.error);
