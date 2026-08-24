const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateWalletAssets() {
  // 1. Generate 3D Wallet Hero Illustration (assets/wallet_hero_3d.png)
  const width = 480;
  const height = 360;

  const walletSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="walletShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#0d47a1" flood-opacity="0.35"/>
      </filter>
      <filter id="coinGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#ffb300" flood-opacity="0.5"/>
      </filter>

      <!-- Gradients -->
      <linearGradient id="leatherGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e88e5"/>
        <stop offset="50%" stop-color="#1565c0"/>
        <stop offset="100%" stop-color="#0d47a1"/>
      </linearGradient>

      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ab47bc"/>
        <stop offset="100%" stop-color="#6a1b9a"/>
      </linearGradient>

      <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff59d"/>
        <stop offset="40%" stop-color="#fbc02d"/>
        <stop offset="100%" stop-color="#e65100"/>
      </linearGradient>

      <linearGradient id="greenCash" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#81c784"/>
        <stop offset="50%" stop-color="#4caf50"/>
        <stop offset="100%" stop-color="#2e7d32"/>
      </linearGradient>
    </defs>

    <!-- Ambient Sparkles -->
    <g opacity="0.5">
      <circle cx="240" cy="180" r="140" fill="radial-gradient(circle, #80d8ff 0%, transparent 70%)" opacity="0.4"/>
    </g>

    <!-- Cash Banknotes Sticking Out from Behind -->
    <!-- Banknote 1 -->
    <g transform="translate(180, 80) rotate(-18)">
      <rect x="0" y="0" width="140" height="70" rx="8" fill="url(#greenCash)" stroke="#ffffff" stroke-width="2"/>
      <rect x="8" y="8" width="124" height="54" rx="4" fill="none" stroke="#a5d6a7" stroke-width="1.5" stroke-dasharray="4,3"/>
      <circle cx="70" cy="35" r="16" fill="#a5d6a7" opacity="0.5"/>
      <text x="70" y="42" font-family="Outfit, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#ffffff">₹500</text>
    </g>

    <!-- Banknote 2 -->
    <g transform="translate(240, 85) rotate(14)">
      <rect x="0" y="0" width="140" height="70" rx="8" fill="url(#greenCash)" stroke="#ffffff" stroke-width="2"/>
      <rect x="8" y="8" width="124" height="54" rx="4" fill="none" stroke="#a5d6a7" stroke-width="1.5" stroke-dasharray="4,3"/>
      <circle cx="70" cy="35" r="16" fill="#a5d6a7" opacity="0.5"/>
      <text x="70" y="42" font-family="Outfit, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#ffffff">₹500</text>
    </g>

    <!-- VIP Platinum Card Sticking Out -->
    <g transform="translate(170, 110) rotate(-8)">
      <rect x="0" y="0" width="150" height="85" rx="10" fill="url(#cardGrad)" stroke="#ba68c8" stroke-width="2"/>
      <!-- Card Chip -->
      <rect x="20" y="25" width="24" height="18" rx="4" fill="#ffd54f"/>
      <text x="130" y="32" font-family="Outfit, sans-serif" font-size="12" font-weight="900" fill="#ffffff">VIP</text>
      <text x="20" y="70" font-family="Courier, monospace" font-size="11" font-weight="900" fill="#e1bee7">•••• 8890</text>
    </g>

    <!-- MAIN 3D LEATHER WALLET -->
    <g filter="url(#walletShadow)">
      <!-- Main Wallet Back Flap -->
      <rect x="110" y="140" width="260" height="150" rx="24" fill="url(#leatherGrad)" stroke="#64b5f6" stroke-width="3"/>
      <!-- Inner Pocket Stitching -->
      <rect x="118" y="148" width="244" height="134" rx="18" fill="none" stroke="#90caf9" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- Front Wallet Flap -->
      <path d="M 110 190 Q 240 215 370 190 L 370 290 Q 240 305 110 290 Z" fill="#0d47a1" stroke="#42a5f5" stroke-width="2.5"/>
      
      <!-- Wallet Metallic Clasp / Button -->
      <g filter="url(#coinGlow)">
        <path d="M 340 220 L 380 220 C 388 220, 392 226, 392 235 C 392 244, 388 250, 380 250 L 340 250 Z" fill="#1565c0" stroke="#90caf9" stroke-width="2"/>
        <circle cx="376" cy="235" r="7" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="1.5"/>
      </g>
    </g>

    <!-- Flying Shiny Gold Coins in Foreground -->
    <g filter="url(#coinGlow)" transform="translate(130, 250) rotate(-15)">
      <ellipse cx="0" cy="0" rx="26" ry="18" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="#f57f17"/>
      <text x="0" y="5" font-family="Outfit, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <g filter="url(#coinGlow)" transform="translate(350, 260) rotate(18)">
      <ellipse cx="0" cy="0" rx="28" ry="20" fill="url(#goldCoin)" stroke="#ffffff" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="20" ry="14" fill="#f57f17"/>
      <text x="0" y="6" font-family="Outfit, sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#fff59d">₹</text>
    </g>

    <!-- Floating Badge: "INSTANT 100% SECURE DEPOSIT" -->
    <g filter="url(#coinGlow)">
      <rect x="90" y="295" width="300" height="42" rx="21" fill="#ffffff" stroke="#ffb300" stroke-width="2.2"/>
      <rect x="94" y="299" width="292" height="34" rx="17" fill="linear-gradient(90deg, #2e7d32 0%, #1b5e20 100%)"/>
      <text x="240" y="321" font-family="Outfit, Arial, sans-serif" font-size="13.5" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="0.4">
        ⚡ 100% INSTANT &amp; SECURE DEPOSITS ⚡
      </text>
    </g>
  </svg>`;

  const walletOut = path.join(__dirname, 'assets', 'wallet_hero_3d.png');
  await sharp(Buffer.from(walletSvg)).png().toFile(walletOut);
  console.log('Created wallet_hero_3d.png:', walletOut);

  // 2. Generate Payment Method Icons (SVG)
  // GPay SVG
  const gpaySvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5"/>
    <path d="M22.5 24.3v-4.6h7.3c.1.4.1.8.1 1.3 0 1.6-.4 3.6-1.7 4.9-1.3 1.3-2.9 2-5.7 2-4.5 0-8.2-3.6-8.2-8.1s3.7-8.1 8.2-8.1c2.5 0 4.2 1 5.5 2.2l-2.3 2.3c-.9-.9-2.2-1.6-3.2-1.6-2.6 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c1.7 0 2.8-.7 3.4-1.3.5-.5.9-1.2 1.1-2.2h-4.5v-3.4z" fill="#4285f4"/>
    <path d="M33 34.5h-3.4V23.7H33v10.8z" fill="#34a853"/>
    <path d="M37.5 27.2c-1.8 0-3.3 1.4-3.3 3.3 0 1.8 1.4 3.3 3.3 3.3 1 0 1.8-.4 2.3-1.1v1h3.2v-9.6H39.8v1c-.6-.7-1.4-1-2.3-1zm.3 2.6c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8z" fill="#fbbc05"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_gpay.svg'), gpaySvg.trim());

  // PhonePe SVG
  const phonepeSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#5f259f"/>
    <path d="M25.5 13H17c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h4.5v-7h4c5 0 9-4 9-9s-4-6-9-6zm0 8.5h-4v-5h4c2.8 0 5 2.2 5 5s-2.2 5-5 5z" fill="#ffffff"/>
    <circle cx="33" cy="27" r="4" fill="#00c853"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_phonepe.svg'), phonepeSvg.trim());

  // Paytm SVG
  const paytmSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5"/>
    <text x="7" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#002e6e">pay</text>
    <text x="31" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#00baf2">tm</text>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_paytm.svg'), paytmSvg.trim());

  // UPI Generic Logo
  const upiSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5"/>
    <path d="M12 28l9-16h6l-9 16h-6z" fill="#097939"/>
    <path d="M21 28l9-16h6l-9 16h-6z" fill="#ed752e"/>
    <path d="M14 36h20v-4H14v4z" fill="#097939"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_upi.svg'), upiSvg.trim());

  // Cards Icon
  const cardsSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#e8f5e9"/>
    <rect x="10" y="14" width="28" height="20" rx="4" fill="#2e7d32"/>
    <rect x="10" y="18" width="28" height="5" fill="#1b5e20"/>
    <rect x="14" y="27" width="6" height="4" rx="1" fill="#ffd54f"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_cards.svg'), cardsSvg.trim());

  // Net Banking Icon
  const netbankingSvg = `
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#ede7f6"/>
    <path d="M24 12l14 7v3H10v-3l14-7zM12 24h4v8h-4zm7 0h4v8h-4zm7 0h4v8h-4zm7 0h4v8h-4zM10 33h28v3H10z" fill="#512da8"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon_netbanking.svg'), netbankingSvg.trim());

  // 3. Generate High-Res Sample QR Code for Instant Dynamic Payments
  const qrSvg = `
  <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
    <rect width="220" height="220" fill="#ffffff" rx="16"/>
    <!-- Corner Finder Patterns -->
    <!-- Top-Left -->
    <rect x="20" y="20" width="48" height="48" fill="#000000" rx="6"/>
    <rect x="26" y="26" width="36" height="36" fill="#ffffff" rx="4"/>
    <rect x="34" y="34" width="20" height="20" fill="#000000" rx="3"/>

    <!-- Top-Right -->
    <rect x="152" y="20" width="48" height="48" fill="#000000" rx="6"/>
    <rect x="158" y="26" width="36" height="36" fill="#ffffff" rx="4"/>
    <rect x="166" y="34" width="20" height="20" fill="#000000" rx="3"/>

    <!-- Bottom-Left -->
    <rect x="20" y="152" width="48" height="48" fill="#000000" rx="6"/>
    <rect x="26" y="158" width="36" height="36" fill="#ffffff" rx="4"/>
    <rect x="34" y="166" width="20" height="20" fill="#000000" rx="3"/>

    <!-- Data Pattern Matrix -->
    <rect x="80" y="22" width="12" height="12" fill="#000000"/>
    <rect x="100" y="22" width="12" height="12" fill="#000000"/>
    <rect x="124" y="22" width="12" height="12" fill="#000000"/>

    <rect x="80" y="42" width="12" height="12" fill="#000000"/>
    <rect x="114" y="42" width="12" height="12" fill="#000000"/>

    <rect x="80" y="62" width="12" height="12" fill="#000000"/>
    <rect x="100" y="62" width="12" height="12" fill="#000000"/>
    <rect x="130" y="62" width="12" height="12" fill="#000000"/>

    <rect x="22" y="80" width="12" height="12" fill="#000000"/>
    <rect x="42" y="80" width="12" height="12" fill="#000000"/>
    <rect x="62" y="80" width="12" height="12" fill="#000000"/>
    <rect x="80" y="80" width="12" height="12" fill="#000000"/>
    <rect x="120" y="80" width="12" height="12" fill="#000000"/>
    <rect x="140" y="80" width="12" height="12" fill="#000000"/>
    <rect x="170" y="80" width="12" height="12" fill="#000000"/>

    <rect x="32" y="100" width="12" height="12" fill="#000000"/>
    <rect x="62" y="100" width="12" height="12" fill="#000000"/>
    <rect x="140" y="100" width="12" height="12" fill="#000000"/>
    <rect x="180" y="100" width="12" height="12" fill="#000000"/>

    <rect x="22" y="120" width="12" height="12" fill="#000000"/>
    <rect x="52" y="120" width="12" height="12" fill="#000000"/>
    <rect x="80" y="120" width="12" height="12" fill="#000000"/>
    <rect x="130" y="120" width="12" height="12" fill="#000000"/>
    <rect x="160" y="120" width="12" height="12" fill="#000000"/>

    <rect x="80" y="140" width="12" height="12" fill="#000000"/>
    <rect x="110" y="140" width="12" height="12" fill="#000000"/>
    <rect x="140" y="140" width="12" height="12" fill="#000000"/>
    <rect x="170" y="140" width="12" height="12" fill="#000000"/>

    <rect x="80" y="160" width="12" height="12" fill="#000000"/>
    <rect x="120" y="160" width="12" height="12" fill="#000000"/>
    <rect x="150" y="160" width="12" height="12" fill="#000000"/>

    <rect x="80" y="180" width="12" height="12" fill="#000000"/>
    <rect x="100" y="180" width="12" height="12" fill="#000000"/>
    <rect x="130" y="180" width="12" height="12" fill="#000000"/>
    <rect x="160" y="180" width="12" height="12" fill="#000000"/>
    <rect x="180" y="180" width="12" height="12" fill="#000000"/>

    <!-- Center Logo Badge (Ludo Bet UPI) -->
    <circle cx="110" cy="110" r="22" fill="#ffffff" stroke="#1e88e5" stroke-width="2.5"/>
    <text x="110" y="116" font-family="Outfit, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#0d47a1">UPI</text>
  </svg>`;

  const qrOut = path.join(__dirname, 'assets', 'payment_qr_code.png');
  await sharp(Buffer.from(qrSvg)).png().toFile(qrOut);
  console.log('Created payment_qr_code.png:', qrOut);
}

generateWalletAssets().catch(console.error);
