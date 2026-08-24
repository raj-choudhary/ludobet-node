const sharp = require('sharp');
const path = require('path');

async function inspectDice() {
  const diceDir = path.join(__dirname, 'assets', 'ludodice');
  for (let i = 1; i <= 6; i++) {
    const meta = await sharp(path.join(diceDir, `dice${i}.png`)).metadata();
    console.log(`dice${i}.png:`, meta.width, 'x', meta.height, 'hasAlpha:', meta.hasAlpha);
  }
}

inspectDice().catch(console.error);
