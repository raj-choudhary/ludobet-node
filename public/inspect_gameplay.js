const sharp = require('sharp');
const path = require('path');

async function inspectGameplayImage() {
  const original = path.join(__dirname, 'ludo-classic_game_play.png');
  const meta = await sharp(original).metadata();
  console.log('Gameplay image size:', meta.width, 'x', meta.height);
}

inspectGameplayImage().catch(console.error);
