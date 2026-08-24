const sharp = require('sharp');
const path = require('path');

async function checkBounds() {
  const meta = await sharp('extracted_original_ui.png').metadata();
  console.log(meta);

  // Tournament banner top: let's test top 1465, height 240
  await sharp('extracted_original_ui.png')
    .extract({ left: 32, top: 1465, width: 788, height: 235 })
    .toFile('assets/tournament_banner_exact.png');

  // Hero Logo Area (Crown + LUDO + TOURNAMENT ribbon + Tagline): let's test top 60, height 490
  await sharp('extracted_original_ui.png')
    .extract({ left: 20, top: 60, width: 813, height: 500 })
    .toFile('assets/hero_title_logo.png');

  // Top background (full header + hero)
  await sharp('extracted_original_ui.png')
    .extract({ left: 0, top: 0, width: 853, height: 835 })
    .toFile('assets/hero_full_section.png');

  console.log('Updated slices with full bounds');
}

checkBounds();
