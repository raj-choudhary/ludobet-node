const sharp = require('sharp');
const path = require('path');

async function cleanTopEdge() {
  const original = 'extracted_original_ui.png';
  const outDir = path.join(__dirname, 'assets');

  // Let's create hero_clean.png from y: 130 to y: 835 (height = 705)
  // or let's create a sky patch on top to cover any shadow artifacts
  const heroImg = await sharp(original)
    .extract({ left: 0, top: 128, width: 853, height: 707 })
    .toBuffer();

  // Let's save hero_clean.png
  await sharp(heroImg).toFile(path.join(outDir, 'hero_clean.png'));

  console.log('hero_clean.png generated cleanly!');
}

cleanTopEdge().catch(console.error);
