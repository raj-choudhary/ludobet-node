const sharp = require('sharp');
const path = require('path');

async function fixHero() {
  const original = 'extracted_original_ui.png';
  const outDir = path.join(__dirname, 'assets');

  // Let's crop from y: 120 down to y: 835 (Crown, Ludo 3D, Pawns, Board)
  // Height = 835 - 120 = 715
  await sharp(original)
    .extract({ left: 0, top: 120, width: 853, height: 715 })
    .toFile(path.join(outDir, 'hero_clean.png'));

  console.log('Created hero_clean.png without duplicate header!');
}

fixHero().catch(console.error);
