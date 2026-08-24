const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createLuxuryWalletAssets() {
  const assetsDir = path.join(__dirname, 'assets');

  // 1. Ultra-Luxury 3D Golden Vault & Wallet Icon (assets/wallet_vault_3d.png)
  const vaultWidth = 320;
  const vaultHeight = 320;
  const vaultSvg = `
  <svg width="${vaultWidth}" height="${vaultHeight}" viewBox="0 0 ${vaultWidth} ${vaultHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#ffb300" flood-opacity="0.6"/>
      </filter>
      <filter id="vaultShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#0a192f" flood-opacity="0.45"/>
      </filter>

      <!-- Gradients -->
      <linearGradient id="vaultBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e3c72"/>
        <stop offset="50%" stop-color="#2a5298"/>
        <stop offset="100%" stop-color="#0f2027"/>
      </linearGradient>

      <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff9c4"/>
        <stop offset="25%" stop-color="#fbc02d"/>
        <stop offset="50%" stop-color="#ffd54f"/>
        <stop offset="75%" stop-color="#f57f17"/>
        <stop offset="100%" stop-color="#ff6f00"/>
      </linearGradient>

      <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fffde7"/>
        <stop offset="35%" stop-color="#ffd54f"/>
        <stop offset="70%" stop-color="#f57f17"/>
        <stop offset="100%" stop-color="#bf360c"/>
      </linearGradient>

      <linearGradient id="greenCashGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a5d6a7"/>
        <stop offset="40%" stop-color="#4caf50"/>
        <stop offset="100%" stop-color="#1b5e20"/>
      </linearGradient>

      <linearGradient id="rubyGem" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff80ab"/>
        <stop offset="50%" stop-color="#f50057"/>
        <stop offset="100%" stop-color="#880e4f"/>
      </linearGradient>
    </defs>

    <!-- Ambient Sparkles -->
    <g opacity="0.8">
      <circle cx="160" cy="160" r="130" fill="radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)"/>
      <polygon points="160,20 164,45 160,70 156,45" fill="#fff9c4"/>
      <polygon points="40,160 65,164 90,160 65,156" fill="#fff9c4"/>
      <polygon points="280,160 255,164 230,160 255,156" fill="#fff9c4"/>
    </g>

    <!-- Flying Cash Notes Behind -->
    <g transform="translate(110, 45) rotate(-16)">
      <rect x="0" y="0" width="100" height="54" rx="8" fill="url(#greenCashGrad)" stroke="#ffffff" stroke-width="1.8"/>
      <rect x="6" y="6" width="88" height="42" rx="4" fill="none" stroke="#c8e6c9" stroke-width="1" stroke-dasharray="3,2"/>
      <circle cx="50" cy="27" r="12" fill="#ffffff" opacity="0.25"/>
      <text x="50" y="32" font-family="Outfit, Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff">₹500</text>
    </g>

    <g transform="translate(170, 50) rotate(18)">
      <rect x="0" y="0" width="100" height="54" rx="8" fill="url(#greenCashGrad)" stroke="#ffffff" stroke-width="1.8"/>
      <rect x="6" y="6" width="88" height="42" rx="4" fill="none" stroke="#c8e6c9" stroke-width="1" stroke-dasharray="3,2"/>
      <circle cx="50" cy="27" r="12" fill="#ffffff" opacity="0.25"/>
      <text x="50" y="32" font-family="Outfit, Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff">₹500</text>
    </g>

    <!-- 3D LUXURY VAULT SAFE CHEST -->
    <g filter="url(#vaultShadow)">
      <!-- Main Safe Body -->
      <rect x="60" y="90" width="200" height="170" rx="32" fill="url(#vaultBody)" stroke="url(#goldRim)" stroke-width="5"/>
      
      <!-- Inner Bevel -->
      <rect x="72" y="102" width="176" height="146" rx="24" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>

      <!-- Vault Safe Wheel Center (Gold Metallic) -->
      <g filter="url(#goldGlow)">
        <circle cx="160" cy="175" r="48" fill="url(#goldRim)" stroke="#ffffff" stroke-width="3"/>
        <circle cx="160" cy="175" r="36" fill="url(#vaultBody)" stroke="url(#goldRim)" stroke-width="2.5"/>
        <circle cx="160" cy="175" r="16" fill="url(#goldRim)"/>
        
        <!-- Safe Wheel Spokes -->
        <line x1="160" y1="130" x2="160" y2="220" stroke="url(#goldRim)" stroke-width="6" stroke-linecap="round"/>
        <line x1="115" y1="175" x2="205" y2="175" stroke="url(#goldRim)" stroke-width="6" stroke-linecap="round"/>
        <line x1="128" y1="143" x2="192" y2="207" stroke="url(#goldRim)" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="207" x2="192" y2="143" stroke="url(#goldRim)" stroke-width="5" stroke-linecap="round"/>

        <!-- Center Gemstone -->
        <circle cx="160" cy="175" r="10" fill="url(#rubyGem)" stroke="#ffffff" stroke-width="1.5"/>
      </g>
    </g>

    <!-- Foreground Overflowing 3D Gold Coins -->
    <!-- Left Coin -->
    <g filter="url(#goldGlow)" transform="translate(70, 220) rotate(-18)">
      <ellipse cx="0" cy="0" rx="30" ry="20" fill="url(#goldCoinGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="#f57f17"/>
      <text x="0" y="6" font-family="Outfit, sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#fffde7">₹</text>
    </g>

    <!-- Right Coin -->
    <g filter="url(#goldGlow)" transform="translate(250, 225) rotate(22)">
      <ellipse cx="0" cy="0" rx="32" ry="22" fill="url(#goldCoinGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <ellipse cx="0" cy="0" rx="24" ry="15" fill="#f57f17"/>
      <text x="0" y="7" font-family="Outfit, sans-serif" font-size="17" font-weight="900" text-anchor="middle" fill="#fffde7">₹</text>
    </g>

    <!-- Center Big Coin -->
    <g filter="url(#goldGlow)" transform="translate(160, 255)">
      <ellipse cx="0" cy="0" rx="36" ry="24" fill="url(#goldCoinGrad)" stroke="#ffffff" stroke-width="3"/>
      <ellipse cx="0" cy="0" rx="26" ry="17" fill="#f57f17"/>
      <text x="0" y="8" font-family="Outfit, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#fffde7">₹</text>
    </g>
  </svg>`;

  const vaultOut = path.join(assetsDir, 'wallet_vault_3d.png');
  await sharp(Buffer.from(vaultSvg)).png().toFile(vaultOut);
  console.log('Created wallet_vault_3d.png:', vaultOut);

  // 2. High-Tech 3D VIP Card Background Texture (assets/card_vip_bg.png)
  const cardWidth = 600;
  const cardHeight = 340;
  const cardSvg = `
  <svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardMesh" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b2b64"/>
        <stop offset="40%" stop-color="#09357a"/>
        <stop offset="80%" stop-color="#061f4a"/>
        <stop offset="100%" stop-color="#03122c"/>
      </linearGradient>
      <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffe082"/>
        <stop offset="50%" stop-color="#ffb300"/>
        <stop offset="100%" stop-color="#ff8f00"/>
      </linearGradient>
      <radialGradient id="meshGlow" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="#7c4dff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    
    <rect width="${cardWidth}" height="${cardHeight}" rx="28" fill="url(#cardMesh)"/>
    <rect width="${cardWidth}" height="${cardHeight}" rx="28" fill="url(#meshGlow)"/>

    <!-- Geometric Light Curves -->
    <path d="M -50 200 Q 200 50 650 180" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="30"/>
    <path d="M -50 240 Q 250 90 650 220" fill="none" stroke="rgba(255,215,0,0.15)" stroke-width="2"/>
    <path d="M -50 280 Q 300 130 650 260" fill="none" stroke="rgba(0,229,255,0.2)" stroke-width="1.5"/>

    <!-- Subtle Dot Grid -->
    <g fill="rgba(255,255,255,0.06)">
      ${Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 12 }).map((_, c) =>
          `<circle cx="${40 + c * 48}" cy="${40 + r * 45}" r="1.5"/>`
        ).join('')
      ).join('')}
    </g>
  </svg>`;

  const cardOut = path.join(assetsDir, 'card_vip_bg.png');
  await sharp(Buffer.from(cardSvg)).png().toFile(cardOut);
  console.log('Created card_vip_bg.png:', cardOut);
}

createLuxuryWalletAssets().catch(console.error);
