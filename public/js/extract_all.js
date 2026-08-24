const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractPixelPerfect() {
  const meta = await sharp('extracted_original_ui.png').metadata();
  console.log('Image dimensions:', meta.width, 'x', meta.height);

  const out = path.join(__dirname, 'assets');

  // 1. Full Hero Background (x: 0, y: 0, w: 853, h: 835)
  await sharp('extracted_original_ui.png')
    .extract({ left: 0, top: 0, width: 853, height: 835 })
    .toFile(path.join(out, 'hero_full_top.png'));

  // 2. Menu Button: (left: 23, top: 22, width: 94, height: 94)
  await sharp('extracted_original_ui.png')
    .extract({ left: 23, top: 22, width: 94, height: 94 })
    .toFile(path.join(out, 'menu_btn.png'));

  // 3. Resource Bar (Chips + Earnings + Bell): (left: 295, top: 22, width: 535, height: 94)
  await sharp('extracted_original_ui.png')
    .extract({ left: 295, top: 22, width: 535, height: 94 })
    .toFile(path.join(out, 'resource_bar.png'));

  // 4. Individual sections of resource bar for clicking:
  // - Chips Section: (left: 295, top: 22, width: 220, height: 94)
  // - Earnings Section: (left: 515, top: 22, width: 215, height: 94)
  // - Bell Section: (left: 730, top: 22, width: 100, height: 94)
  await sharp('extracted_original_ui.png')
    .extract({ left: 295, top: 22, width: 220, height: 94 })
    .toFile(path.join(out, 'res_chips.png'));

  await sharp('extracted_original_ui.png')
    .extract({ left: 515, top: 22, width: 215, height: 94 })
    .toFile(path.join(out, 'res_earnings.png'));

  await sharp('extracted_original_ui.png')
    .extract({ left: 730, top: 22, width: 100, height: 94 })
    .toFile(path.join(out, 'res_bell.png'));

  // 5. Hero Logo (Crown + 3D LUDO + TOURNAMENT Ribbon + Tagline):
  // left: 10, top: 60, width: 833, height: 490
  await sharp('extracted_original_ui.png')
    .extract({ left: 10, top: 60, width: 833, height: 490 })
    .toFile(path.join(out, 'hero_title_logo.png'));

  // 6. Perspective Ludo Board Art (3D Board + 4 Pawns + Central Dice + Leaves):
  // left: 0, top: 540, width: 853, height: 285
  await sharp('extracted_original_ui.png')
    .extract({ left: 0, top: 540, width: 853, height: 285 })
    .toFile(path.join(out, 'hero_board_3d.png'));

  // 7. Choose Your Game Banner:
  // left: 30, top: 835, width: 793, height: 45
  await sharp('extracted_original_ui.png')
    .extract({ left: 30, top: 835, width: 793, height: 45 })
    .toFile(path.join(out, 'choose_game_header.png'));

  // 8. 4 Game Cards (Exact Bounding Boxes):
  // Card 1: Ludo Classic (left: 32, top: 888, width: 384, height: 280)
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 888, width: 384, height: 280 })
    .toFile(path.join(out, 'card_ludo_classic_exact.png'));

  // Card 2: Ludo Quick (left: 436, top: 888, width: 384, height: 280)
  await sharp('extracted_original_ui.png')
    .extract({ left: 436, top: 888, width: 384, height: 280 })
    .toFile(path.join(out, 'card_ludo_quick_exact.png'));

  // Card 3: Snake & Ladders (left: 32, top: 1198, width: 384, height: 280)
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 1198, width: 384, height: 280 })
    .toFile(path.join(out, 'card_snake_exact.png'));

  // Card 4: New Game (left: 436, top: 1198, width: 384, height: 280)
  await sharp('extracted_original_ui.png')
    .extract({ left: 436, top: 1198, width: 384, height: 280 })
    .toFile(path.join(out, 'card_newgame_exact.png'));

  // 9. Upcoming Tournament Banner (left: 32, top: 1465, width: 788, height: 235)
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 1465, width: 788, height: 235 })
    .toFile(path.join(out, 'tournament_banner_exact.png'));

  // 10. Bottom Navigation Bar:
  // Let's test top: 1690, height: 145
  await sharp('extracted_original_ui.png')
    .extract({ left: 16, top: 1695, width: 820, height: 135 })
    .toFile(path.join(out, 'bottom_nav_exact.png'));

  // 11. Individual Nav Icons (for active state toggling & animations):
  // Home (active)
  await sharp('extracted_original_ui.png')
    .extract({ left: 16, top: 1695, width: 164, height: 135 })
    .toFile(path.join(out, 'nav_home_item.png'));

  // Ranking
  await sharp('extracted_original_ui.png')
    .extract({ left: 180, top: 1695, width: 164, height: 135 })
    .toFile(path.join(out, 'nav_ranking_item.png'));

  // Wallet
  await sharp('extracted_original_ui.png')
    .extract({ left: 344, top: 1695, width: 164, height: 135 })
    .toFile(path.join(out, 'nav_wallet_item.png'));

  // Refer
  await sharp('extracted_original_ui.png')
    .extract({ left: 508, top: 1695, width: 164, height: 135 })
    .toFile(path.join(out, 'nav_refer_item.png'));

  // Profile
  await sharp('extracted_original_ui.png')
    .extract({ left: 672, top: 1695, width: 164, height: 135 })
    .toFile(path.join(out, 'nav_profile_item.png'));

  console.log('All slices extracted pixel-perfect!');
}

extractPixelPerfect().catch(console.error);
