const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createProfileAssets() {
  const assetsDir = path.join(__dirname, 'assets');

  // 1. Rajendra Main Profile Avatar (assets/avatar_rajendra.png)
  const avatarSvg = `
  <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#42a5f5"/>
        <stop offset="100%" stop-color="#1565c0"/>
      </linearGradient>
      <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e53935"/>
        <stop offset="100%" stop-color="#b71c1c"/>
      </linearGradient>
      <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#37474f"/>
        <stop offset="100%" stop-color="#212121"/>
      </linearGradient>
    </defs>
    <!-- Circle Background -->
    <circle cx="120" cy="120" r="116" fill="url(#bgGrad)" stroke="#ffffff" stroke-width="6"/>
    
    <!-- Body / Red Hoodie Jacket -->
    <path d="M 50 220 C 50 170, 80 155, 120 155 C 160 155, 190 170, 190 220 Z" fill="url(#jacketGrad)"/>
    <path d="M 100 160 L 120 200 L 140 160 Z" fill="#ffffff" opacity="0.9"/>

    <!-- Neck -->
    <rect x="106" y="130" width="28" height="30" fill="#ffcc80" rx="6"/>

    <!-- Face -->
    <ellipse cx="120" cy="115" rx="42" ry="46" fill="#ffe0b2"/>

    <!-- Eyes & Smile -->
    <circle cx="106" cy="112" r="5" fill="#212121"/>
    <circle cx="134" cy="112" r="5" fill="#212121"/>
    <circle cx="108" cy="110" r="1.5" fill="#ffffff"/>
    <circle cx="136" cy="110" r="1.5" fill="#ffffff"/>
    <!-- Eyebrows -->
    <path d="M 98 102 Q 106 98 114 102" stroke="#212121" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 126 102 Q 134 98 142 102" stroke="#212121" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M 108 132 Q 120 144 132 132" stroke="#d84315" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Hair -->
    <path d="M 78 110 C 75 70, 100 65, 120 65 C 145 65, 165 70, 162 110 C 155 85, 140 80, 120 80 C 100 80, 85 85, 78 110 Z" fill="url(#hairGrad)"/>
    <path d="M 85 75 Q 120 50 155 75 Z" fill="url(#hairGrad)"/>
  </svg>`;

  await sharp(Buffer.from(avatarSvg)).png().toFile(path.join(assetsDir, 'avatar_rajendra.png'));
  console.log('Created avatar_rajendra.png');

  // 2. Achievement Badges (SVGs)
  const badges = [
    {
      name: 'badge_first_win.svg',
      color1: '#ff9800', color2: '#e65100',
      icon: '⚡', title: 'First Win'
    },
    {
      name: 'badge_win_streak.svg',
      color1: '#2196f3', color2: '#0d47a1',
      icon: '⭐', title: 'Win Streak'
    },
    {
      name: 'badge_big_winner.svg',
      color1: '#ffca28', color2: '#ff8f00',
      icon: '👑', title: 'Big Winner'
    },
    {
      name: 'badge_quick_player.svg',
      color1: '#8d6e63', color2: '#4e342e',
      icon: '⏱️', title: 'Quick Player'
    }
  ];

  for (const b of badges) {
    const badgeSvg = `
    <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad_${b.name}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${b.color1}"/>
          <stop offset="100%" stop-color="${b.color2}"/>
        </linearGradient>
      </defs>
      <!-- Outer Ribbon Medal -->
      <circle cx="40" cy="40" r="36" fill="url(#grad_${b.name})" stroke="#ffffff" stroke-width="3"/>
      <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="40" y="48" font-size="24" text-anchor="middle">${b.icon}</text>
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, b.name), badgeSvg.trim());
  }

  console.log('Created achievement badges.');
}

createProfileAssets().catch(console.error);
