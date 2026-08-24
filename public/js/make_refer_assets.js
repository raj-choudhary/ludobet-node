const sharp = require('sharp');
const path = require('path');

// 1. Generate 3D Refer Hero Illustration (assets/refer_hero_3d.png)
async function generateReferHero() {
  const width = 500;
  const height = 400;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Glow Filter -->
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#ffb300" flood-opacity="0.6"/>
      </filter>

      <filter id="boxShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#311b92" flood-opacity="0.4"/>
      </filter>

      <!-- Gradients -->
      <linearGradient id="purpleBox" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8e24aa"/>
        <stop offset="50%" stop-color="#6a1b9a"/>
        <stop offset="100%" stop-color="#4a148c"/>
      </linearGradient>

      <linearGradient id="purpleLid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ab47bc"/>
        <stop offset="100%" stop-color="#7b1fa2"/>
      </linearGradient>

      <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffe082"/>
        <stop offset="40%" stop-color="#ffca28"/>
        <stop offset="80%" stop-color="#ffb300"/>
        <stop offset="100%" stop-color="#ffa000"/>
      </linearGradient>

      <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff59d"/>
        <stop offset="30%" stop-color="#fbc02d"/>
        <stop offset="70%" stop-color="#f57f17"/>
        <stop offset="100%" stop-color="#e65100"/>
      </linearGradient>

      <linearGradient id="cyanDiamond" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0f7fa"/>
        <stop offset="40%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#0091ea"/>
      </linearGradient>
    </defs>

    <!-- Ambient Sparkle Rays -->
    <g opacity="0.6">
      <circle cx="250" cy="200" r="160" fill="radial-gradient(circle, #ffeb3b 0%, transparent 70%)" opacity="0.3"/>
      <path d="M 250 50 L 255 100 L 250 150 L 245 100 Z" fill="#ffe082"/>
      <path d="M 120 180 L 160 190 L 120 200 L 150 190 Z" fill="#ffe082"/>
      <path d="M 380 180 L 340 190 L 380 200 L 350 190 Z" fill="#ffe082"/>
    </g>

    <!-- Flying Gold Coins & Diamonds Behind Box -->
    <!-- Left Coin -->
    <g filter="url(#goldGlow)" transform="translate(130, 110) rotate(-20)">
      <ellipse cx="0" cy="0" rx="26" ry="18" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="#f57f17"/>
      <text x="0" y="5" font-family="Outfit, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Right Coin -->
    <g filter="url(#goldGlow)" transform="translate(370, 120) rotate(25)">
      <ellipse cx="0" cy="0" rx="28" ry="20" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="20" ry="13" fill="#f57f17"/>
      <text x="0" y="6" font-family="Outfit, sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Flying Cyan Diamond -->
    <g transform="translate(340, 70) rotate(15)">
      <polygon points="0,-18 16,0 0,18 -16,0" fill="url(#cyanDiamond)" stroke="#ffffff" stroke-width="1.8"/>
      <polygon points="0,-18 16,0 0,5" fill="#ffffff" opacity="0.6"/>
    </g>

    <!-- Flying Small Coin Top -->
    <g filter="url(#goldGlow)" transform="translate(190, 60) rotate(10)">
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="1.5"/>
      <text x="0" y="4" font-family="Outfit, sans-serif" font-size="10" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- MAIN 3D GIFT BOX BODY -->
    <g filter="url(#boxShadow)">
      <!-- Main Box Cube Base -->
      <path d="M 160 210 L 340 210 L 320 330 L 180 330 Z" fill="url(#purpleBox)" stroke="#4a148c" stroke-width="3"/>
      <!-- Box Left Depth Shadow -->
      <path d="M 160 210 L 195 210 L 205 330 L 180 330 Z" fill="#311b92" opacity="0.4"/>
      <!-- Vertical Gold Ribbon -->
      <path d="M 230 210 L 270 210 L 265 330 L 235 330 Z" fill="url(#goldRibbon)" stroke="#ff8f00" stroke-width="1.5"/>
      <!-- Ribbon Center Glint -->
      <line x1="250" y1="210" x2="250" y2="330" stroke="#fff9c4" stroke-width="3" opacity="0.8"/>
      <!-- Horizontal Gold Ribbon -->
      <path d="M 168 260 L 332 260 L 330 280 L 170 280 Z" fill="url(#goldRibbon)" stroke="#ff8f00" stroke-width="1.5"/>

      <!-- OPEN BOX LID (Tilted Up) -->
      <g transform="translate(250, 195) rotate(-14) translate(-250, -195)">
        <rect x="145" y="165" width="210" height="42" rx="10" fill="url(#purpleLid)" stroke="#ba68c8" stroke-width="2.5"/>
        <!-- Lid Ribbon -->
        <rect x="235" y="165" width="30" height="42" fill="url(#goldRibbon)" stroke="#ff8f00" stroke-width="1.5"/>
        <line x1="250" y1="165" x2="250" y2="207" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
      </g>
    </g>

    <!-- Massive 3D Golden Bow on Top -->
    <g filter="url(#goldGlow)">
      <!-- Left Bow Loop -->
      <path d="M 235 155 C 180 110, 170 180, 235 165 Z" fill="url(#goldRibbon)" stroke="#ff6f00" stroke-width="2"/>
      <path d="M 235 155 C 190 125, 185 165, 235 160 Z" fill="#ffe082" opacity="0.8"/>
      <!-- Right Bow Loop -->
      <path d="M 265 155 C 320 110, 330 180, 265 165 Z" fill="url(#goldRibbon)" stroke="#ff6f00" stroke-width="2"/>
      <path d="M 265 155 C 310 125, 315 165, 265 160 Z" fill="#ffe082" opacity="0.8"/>
      <!-- Bow Knot -->
      <circle cx="250" cy="160" r="16" fill="url(#goldRibbon)" stroke="#e65100" stroke-width="2.5"/>
      <circle cx="248" cy="156" r="5" fill="#ffffff" opacity="0.7"/>
    </g>

    <!-- Foreground Overflowing Coins -->
    <g filter="url(#goldGlow)" transform="translate(250, 195)">
      <!-- Front Giant Coin -->
      <ellipse cx="0" cy="5" rx="34" ry="24" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="2.5"/>
      <ellipse cx="0" cy="5" rx="24" ry="16" fill="#f57f17"/>
      <text x="0" y="12" font-family="Outfit, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Left Small Coin -->
    <g filter="url(#goldGlow)" transform="translate(195, 215) rotate(-15)">
      <ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="1.8"/>
      <text x="0" y="5" font-family="Outfit, sans-serif" font-size="12" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Right Small Coin -->
    <g filter="url(#goldGlow)" transform="translate(305, 215) rotate(18)">
      <ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="1.8"/>
      <text x="0" y="5" font-family="Outfit, sans-serif" font-size="12" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Floating 3D Badge: "GET ₹100 PER FRIEND" -->
    <g filter="url(#goldGlow)">
      <rect x="110" y="325" width="280" height="46" rx="23" fill="#ffffff" stroke="#ffb300" stroke-width="2.5"/>
      <rect x="114" y="329" width="272" height="38" rx="19" fill="linear-gradient(90deg, #ff8f00 0%, #ff6f00 100%)"/>
      <text x="250" y="354" font-family="Outfit, Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">
        ⚡ GET ₹100 PER FRIEND ⚡
      </text>
    </g>
  </svg>`;

  const outPath = path.join(__dirname, 'assets', 'refer_hero_3d.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('Created high-def Refer Hero 3D Illustration:', outPath);
}

// 2. Generate Social Sharing SVG Icons
async function generateSocialIcons() {
  const fs = require('fs');

  // WhatsApp Icon
  const whatsappSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="23" fill="url(#waGrad)"/>
    <defs>
      <linearGradient id="waGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2fe063"/>
        <stop offset="100%" stop-color="#1eb846"/>
      </linearGradient>
    </defs>
    <path d="M24 10C16.3 10 10 16.3 10 24c0 2.7.8 5.3 2.3 7.5L10 38l6.7-2.2c2.1 1.3 4.6 2.2 7.3 2.2 7.7 0 14-6.3 14-14s-6.3-14-14-14zm7.3 19.8c-.3.9-1.8 1.6-2.5 1.7-.7.1-1.5.2-4.5-1-3.6-1.5-6-5.2-6.2-5.4-.2-.3-1.5-2-1.5-3.8 0-1.8.9-2.7 1.3-3.1.3-.3.8-.5 1.2-.5.1 0 .3 0 .4.1.4 0 .6.1.8.6.3.8 1.1 2.7 1.2 2.9.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.4-.6.6-.2.2-.4.4-.2.8.3.5 1.2 2 2.6 3.2 1.8 1.6 3.3 2.1 3.7 2.3.4.2.7.2.9-.1.3-.3 1.2-1.4 1.5-1.9.3-.5.7-.4 1.1-.3.4.1 2.7 1.3 3.2 1.5.5.3.8.4.9.6.1.3.1 1.5-.2 2.3z" fill="#ffffff"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_whatsapp.svg'), whatsappSvg.trim());

  // Telegram Icon
  const telegramSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="23" fill="url(#tgGrad)"/>
    <defs>
      <linearGradient id="tgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#29b6f6"/>
        <stop offset="100%" stop-color="#0288d1"/>
      </linearGradient>
    </defs>
    <path d="M12 23.5l20-7.7c.9-.4 1.7.2 1.4 1.6l-3.4 16c-.2 1.1-.9 1.4-1.8.9l-5.2-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3 9.6-8.7c.4-.4-.1-.6-.6-.3l-11.9 7.5-5.1-1.6c-1.1-.3-1.1-1.1.1-1.5z" fill="#ffffff"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_telegram.svg'), telegramSvg.trim());

  console.log('Created WhatsApp and Telegram share icons.');
}

async function run() {
  await generateReferHero();
  await generateSocialIcons();
}

run().catch(console.error);
