const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fineTune() {
  const meta = await sharp('extracted_original_ui.png').metadata();
  console.log('Original image dimensions:', meta.width, 'x', meta.height);
  const W = meta.width; // 853
  const H = meta.height; // 1843

  const outDir = path.join(__dirname, 'assets');

  // Let's extract:
  // 1. Full Top Ambient Background & Hero Section (0, 0, 853, 850)
  await sharp('extracted_original_ui.png')
    .extract({ left: 0, top: 0, width: W, height: 840 })
    .toFile(path.join(outDir, 'hero_full_section.png'));

  // 2. Menu Button:
  // Let's crop x: 20 to 116, y: 20 to 116
  await sharp('extracted_original_ui.png')
    .extract({ left: 24, top: 24, width: 92, height: 92 })
    .toFile(path.join(outDir, 'menu_btn.png'));

  // 3. Resource Pill Bar:
  await sharp('extracted_original_ui.png')
    .extract({ left: 295, top: 22, width: 534, height: 96 })
    .toFile(path.join(outDir, 'resource_bar.png'));

  // 4. Crown + 3D LUDO + TOURNAMENT + Tagline
  await sharp('extracted_original_ui.png')
    .extract({ left: 10, top: 120, width: 833, height: 440 })
    .toFile(path.join(outDir, 'hero_title_logo.png'));

  // 5. Perspective Ludo Board Art
  await sharp('extracted_original_ui.png')
    .extract({ left: 0, top: 540, width: W, height: 300 })
    .toFile(path.join(outDir, 'hero_board_3d.png'));

  // 6. "CHOOSE YOUR GAME" Header
  await sharp('extracted_original_ui.png')
    .extract({ left: 30, top: 830, width: 793, height: 50 })
    .toFile(path.join(outDir, 'choose_game_header.png'));

  // 7. Cards:
  // Card 1: Ludo Classic
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 888, width: 384, height: 290 })
    .toFile(path.join(outDir, 'card_ludo_classic_exact.png'));

  // Card 2: Ludo Quick
  await sharp('extracted_original_ui.png')
    .extract({ left: 436, top: 888, width: 384, height: 290 })
    .toFile(path.join(outDir, 'card_ludo_quick_exact.png'));

  // Card 3: Snake & Ladders
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 1198, width: 384, height: 290 })
    .toFile(path.join(outDir, 'card_snake_exact.png'));

  // Card 4: New Game
  await sharp('extracted_original_ui.png')
    .extract({ left: 436, top: 1198, width: 384, height: 290 })
    .toFile(path.join(outDir, 'card_newgame_exact.png'));

  // 8. Upcoming Tournament Banner
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 1508, width: 788, height: 200 })
    .toFile(path.join(outDir, 'tournament_banner_exact.png'));

  // 9. Bottom Navigation Bar
  await sharp('extracted_original_ui.png')
    .extract({ left: 16, top: 1720, width: 820, height: 112 })
    .toFile(path.join(outDir, 'bottom_nav_exact.png'));

  console.log('Fine-tuned slices extracted!');
}

fineTune().catch(console.error);
