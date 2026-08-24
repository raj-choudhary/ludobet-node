const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createLeaderboardAssets() {
  const assetsDir = path.join(__dirname, 'assets');

  // 1. Gold Trophy 3D Icon (assets/trophy_gold_3d.png)
  const trophySvg = `
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldCup" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fffde7"/>
        <stop offset="25%" stop-color="#ffd54f"/>
        <stop offset="60%" stop-color="#ffb300"/>
        <stop offset="90%" stop-color="#f57f17"/>
        <stop offset="100%" stop-color="#e65100"/>
      </linearGradient>
      <linearGradient id="cupBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#37474f"/>
        <stop offset="50%" stop-color="#263238"/>
        <stop offset="100%" stop-color="#102027"/>
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#ffb300" flood-opacity="0.6"/>
      </filter>
    </defs>

    <!-- Ambient Glow -->
    <circle cx="100" cy="90" r="70" fill="radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)"/>

    <!-- Trophy Handles -->
    <path d="M 40 60 C 20 60, 20 100, 55 105" fill="none" stroke="url(#goldCup)" stroke-width="12" stroke-linecap="round"/>
    <path d="M 160 60 C 180 60, 180 100, 145 105" fill="none" stroke="url(#goldCup)" stroke-width="12" stroke-linecap="round"/>

    <!-- Cup Body -->
    <g filter="url(#goldGlow)">
      <path d="M 50 45 L 150 45 L 138 110 C 130 135, 70 135, 62 110 Z" fill="url(#goldCup)" stroke="#ffffff" stroke-width="2.5"/>
      <ellipse cx="100" cy="45" rx="50" ry="12" fill="#fff9c4" stroke="#ffb300" stroke-width="2"/>
      <!-- Cup Glint -->
      <path d="M 68 55 Q 75 100 85 115" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>
      <!-- Star on Cup -->
      <polygon points="100,70 104,80 114,80 106,87 109,97 100,91 91,97 94,87 86,80 96,80" fill="#ffffff" opacity="0.9"/>
    </g>

    <!-- Cup Stem -->
    <rect x="92" y="125" width="16" height="24" rx="4" fill="url(#goldCup)"/>
    <ellipse cx="100" cy="148" rx="28" ry="8" fill="url(#goldCup)"/>

    <!-- Trophy Base Pedestal -->
    <rect x="65" y="152" width="70" height="28" rx="6" fill="url(#cupBase)" stroke="#455a64" stroke-width="2"/>
    <rect x="72" y="158" width="56" height="16" rx="3" fill="#ffb300"/>
    <text x="100" y="170" font-family="Outfit, sans-serif" font-size="11" font-weight="900" text-anchor="middle" fill="#000000">#1 RANK</text>
  </svg>`;

  const trophyOut = path.join(assetsDir, 'trophy_gold_3d.png');
  await sharp(Buffer.from(trophySvg)).png().toFile(trophyOut);
  console.log('Created trophy_gold_3d.png:', trophyOut);

  // 2. Extra Player Avatars
  const avatars = [
    { name: 'avatar_priya.png', bg: '#ec407a', emoji: '👩‍🦰', gender: 'F' },
    { name: 'avatar_samir.png', bg: '#42a5f5', emoji: '🧔', gender: 'M' },
    { name: 'avatar_anita.png', bg: '#ab47bc', emoji: '👩', gender: 'F' },
    { name: 'avatar_karan.png', bg: '#26a69a', emoji: '👨‍🦱', gender: 'M' }
  ];

  for (const av of avatars) {
    const avSvg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${av.bg}" stroke="#ffffff" stroke-width="4"/>
      <text x="50" y="65" font-size="44" text-anchor="middle">${av.emoji}</text>
    </svg>`;
    const avPath = path.join(assetsDir, av.name);
    await sharp(Buffer.from(avSvg)).png().toFile(avPath);
  }
  console.log('Created extra leaderboard avatars.');
}

createLeaderboardAssets().catch(console.error);
