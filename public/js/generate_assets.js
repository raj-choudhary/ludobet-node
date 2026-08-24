const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractAllAssets() {
  const original = path.join(__dirname, 'extracted_original_ui.png');
  const outDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(original).metadata();
  console.log('Original image dimensions:', meta.width, 'x', meta.height);
  const W = meta.width; // 853
  const H = meta.height; // 1843

  // 1. Full Hero Background Artwork (From top to the Choose Game section)
  await sharp(original)
    .extract({ left: 0, top: 0, width: W, height: 835 })
    .toFile(path.join(outDir, 'hero_full_top.png'));

  // 2. Menu Button (Squircle)
  await sharp(original)
    .extract({ left: 23, top: 22, width: 94, height: 94 })
    .toFile(path.join(outDir, 'menu_btn.png'));

  // 3. Resource Pill Bar
  await sharp(original)
    .extract({ left: 295, top: 22, width: 535, height: 94 })
    .toFile(path.join(outDir, 'resource_bar.png'));

  // 4. "CHOOSE YOUR GAME" Header
  await sharp(original)
    .extract({ left: 10, top: 828, width: 833, height: 52 })
    .toFile(path.join(outDir, 'choose_game_header.png'));

  // 5. Four 3D Game Cards:
  // Card 1: Ludo Classic
  await sharp(original)
    .extract({ left: 32, top: 888, width: 384, height: 280 })
    .toFile(path.join(outDir, 'card_ludo_classic_exact.png'));

  // Card 2: Ludo Quick
  await sharp(original)
    .extract({ left: 436, top: 888, width: 384, height: 280 })
    .toFile(path.join(outDir, 'card_ludo_quick_exact.png'));

  // Card 3: Snake & Ladders
  await sharp(original)
    .extract({ left: 32, top: 1198, width: 384, height: 280 })
    .toFile(path.join(outDir, 'card_snake_exact.png'));

  // Card 4: New Game
  await sharp(original)
    .extract({ left: 436, top: 1198, width: 384, height: 280 })
    .toFile(path.join(outDir, 'card_newgame_exact.png'));

  // 6. Upcoming Tournament Banner
  await sharp(original)
    .extract({ left: 32, top: 1465, width: 788, height: 235 })
    .toFile(path.join(outDir, 'tournament_banner_exact.png'));

  // 7. Bottom Floating Nav Bar
  await sharp(original)
    .extract({ left: 16, top: 1695, width: 820, height: 135 })
    .toFile(path.join(outDir, 'bottom_nav_exact.png'));

  // 8. Individual Nav items for custom tab switching
  const navWidth = Math.floor(820 / 5); // 164
  const tabs = ['home', 'ranking', 'wallet', 'refer', 'profile'];
  for (let i = 0; i < tabs.length; i++) {
    await sharp(original)
      .extract({ left: 16 + (i * navWidth), top: 1695, width: navWidth, height: 135 })
      .toFile(path.join(outDir, `nav_${tabs[i]}.png`));
  }

  // 9. Full page background (seamless pattern/gradient)
  // Let's create a sky blue gradient wallpaper
  await sharp(original)
    .extract({ left: 0, top: 0, width: W, height: H })
    .toFile(path.join(outDir, 'full_screen_reference.png'));

  console.log('All HD production assets generated successfully!');
}

extractAllAssets().catch(console.error);
