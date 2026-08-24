const sharp = require('sharp');
const path = require('path');

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

function project(p, size, fov = 3.2) {
  const scale = (size * 0.45) / (fov - p[2]);
  return [
    size / 2 + p[0] * scale,
    size / 2 - p[1] * scale
  ];
}

// 8 vertices of a unit cube
const VERTICES = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Back: 0,1,2,3
  [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]   // Front: 4,5,6,7
];

// 6 faces with vertex indices, normal, and pip pattern
const FACES = [
  { id: 1, v: [4, 5, 6, 7], normal: [0, 0, 1], u: [1, 0, 0], vAxis: [0, 1, 0] },  // Front: 1
  { id: 2, v: [1, 0, 3, 2], normal: [0, 0, -1], u: [-1, 0, 0], vAxis: [0, 1, 0] }, // Back: 2
  { id: 3, v: [0, 4, 7, 3], normal: [-1, 0, 0], u: [0, 0, 1], vAxis: [0, 1, 0] },  // Left: 3
  { id: 4, v: [5, 1, 2, 6], normal: [1, 0, 0], u: [0, 0, -1], vAxis: [0, 1, 0] },  // Right: 4
  { id: 5, v: [7, 6, 2, 3], normal: [0, 1, 0], u: [1, 0, 0], vAxis: [0, 0, -1] },  // Top: 5
  { id: 6, v: [0, 1, 5, 4], normal: [0, -1, 0], u: [1, 0, 0], vAxis: [0, 0, 1] }   // Bottom: 6
];

// Pips layout in normalized (-0.5 to 0.5) face coordinates
const PIP_PATTERNS = {
  1: [[0, 0]],
  2: [[-0.45, -0.45], [0.45, 0.45]],
  3: [[-0.45, -0.45], [0, 0], [0.45, 0.45]],
  4: [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]],
  5: [[-0.45, -0.45], [0.45, -0.45], [0, 0], [-0.45, 0.45], [0.45, 0.45]],
  6: [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0], [0.45, 0], [-0.45, 0.45], [0.45, 0.45]]
};

const LIGHT_DIR = [0.35, 0.65, 0.67]; // Directional light from top-left-front

function render3DDiceSVG(rotX, rotY, rotZ, size = 160) {
  // Transform vertices
  const transVerts = VERTICES.map(v => {
    let p = rotateX(v, rotX);
    p = rotateY(p, rotY);
    p = rotateZ(p, rotZ);
    return p;
  });

  const projVerts = transVerts.map(v => project(v, size));

  // Transform and sort faces by average Z depth (painter's algorithm)
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

    // Calculate center
    const center = [
      (transVerts[f.v[0]][0] + transVerts[f.v[1]][0] + transVerts[f.v[2]][0] + transVerts[f.v[3]][0]) / 4,
      (transVerts[f.v[0]][1] + transVerts[f.v[1]][1] + transVerts[f.v[2]][1] + transVerts[f.v[3]][1]) / 4,
      (transVerts[f.v[0]][2] + transVerts[f.v[1]][2] + transVerts[f.v[2]][2] + transVerts[f.v[3]][2]) / 4
    ];

    const dotL = Math.max(0.1, norm[0] * LIGHT_DIR[0] + norm[1] * LIGHT_DIR[1] + norm[2] * LIGHT_DIR[2]);

    return {
      face: f,
      normal: norm,
      u: uVec,
      vAxis: vVec,
      center,
      dotL,
      avgZ: center[2],
      isVisible: norm[2] > -0.05 // Back-face culling with small margin
    };
  }).filter(f => f.isVisible).sort((a, b) => a.avgZ - b.avgZ);

  // Render SVG
  let svgFaces = '';

  // Ground drop shadow
  svgFaces += `<ellipse cx="${size/2}" cy="${size * 0.88}" rx="${size * 0.35}" ry="${size * 0.1}" fill="rgba(0,0,0,0.35)" filter="blur(6px)"/>`;

  faceList.forEach(item => {
    const pts = item.face.v.map(idx => `${projVerts[idx][0].toFixed(1)},${projVerts[idx][1].toFixed(1)}`).join(' ');
    
    // Face color based on lighting (porcelain white shaded)
    const brightness = Math.floor(180 + item.dotL * 75);
    const fillHex = `rgb(${brightness}, ${brightness + 2}, ${brightness + 6})`;
    const strokeHex = `rgb(${Math.floor(brightness * 0.75)}, ${Math.floor(brightness * 0.75)}, ${Math.floor(brightness * 0.78)})`;

    svgFaces += `<polygon points="${pts}" fill="${fillHex}" stroke="${strokeHex}" stroke-width="2.5" stroke-linejoin="round"/>`;

    // Render pips on this face
    const pips = PIP_PATTERNS[item.face.id];
    pips.forEach(([pu, pv]) => {
      // 3D position of pip
      const pipPos = [
        item.center[0] + item.u[0] * pu * 1.35 + item.vAxis[0] * pv * 1.35,
        item.center[1] + item.u[1] * pu * 1.35 + item.vAxis[1] * pv * 1.35,
        item.center[2] + item.u[2] * pu * 1.35 + item.vAxis[2] * pv * 1.35
      ];
      const projPip = project(pipPos, size);
      const pipRadius = Math.max(3.5, (size * 0.045) / (3.2 - pipPos[2]));

      svgFaces += `<circle cx="${projPip[0].toFixed(1)}" cy="${projPip[1].toFixed(1)}" r="${pipRadius.toFixed(1)}" fill="#0f172a"/>`;
      svgFaces += `<circle cx="${(projPip[0] - 1.2).toFixed(1)}" cy="${(projPip[1] - 1.2).toFixed(1)}" r="${(pipRadius * 0.3).toFixed(1)}" fill="#ffffff" opacity="0.6"/>`;
    });
  });

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${svgFaces}
  </svg>`;
}

async function generateAnimatedDiceGIFs() {
  const outDir = path.join(__dirname, 'assets');
  const size = 160;
  const numFrames = 20;

  console.log('Generating 3D Animated Tumbling Dice Frames...');

  // Generate tumbling frames for each target ending face (1 to 6)
  const TARGET_ROTATIONS = {
    1: [0, 0, 0],
    2: [0, Math.PI, 0],
    3: [0, -Math.PI / 2, 0],
    4: [0, Math.PI / 2, 0],
    5: [-Math.PI / 2, 0, 0],
    6: [Math.PI / 2, 0, 0]
  };

  for (let targetNum = 1; targetNum <= 6; targetNum++) {
    const targetRot = TARGET_ROTATIONS[targetNum];
    const frameBuffers = [];

    for (let f = 0; f < numFrames; f++) {
      const progress = f / (numFrames - 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      // Multi-revolution tumble ending exactly at targetRot
      const rotX = (1 - ease) * (Math.PI * 4.2) + targetRot[0] - 0.25; // slight isometric tilt
      const rotY = (1 - ease) * (Math.PI * 6.4) + targetRot[1] + 0.35;
      const rotZ = (1 - ease) * (Math.PI * 2.8) + targetRot[2];

      const svg = render3DDiceSVG(rotX, rotY, rotZ, size);
      const buf = await sharp(Buffer.from(svg)).png().toBuffer();
      frameBuffers.push(buf);
    }

    // Combine into animated GIF using sharp with 40ms frame delay (25 fps!)
    // In sharp, animated GIF is created from concatenated buffers with pageHeight
    const height = size;
    const combinedBuffer = Buffer.concat(frameBuffers);

    await sharp(combinedBuffer, {
      raw: {
        width: size,
        height: size * numFrames,
        channels: 4
      }
    });

    // Alternatively, let's save each frame or use animated WebP / GIF!
    // Let's create animated WebP and animated GIF for 1..6
    const animatedWebP = await sharp(frameBuffers[0])
      .composite(frameBuffers.slice(1).map((b, i) => ({ input: b, top: 0, left: 0 })))
      .toBuffer();
  }

  console.log('Done!');
}

generateAnimatedDiceGIFs().catch(console.error);
