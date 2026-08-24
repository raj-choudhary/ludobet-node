const sharp = require('sharp');
const path = require('path');

async function inspectFlowImage() {
  const imgPath = path.join(__dirname, 'ludo_classic_battle_flow_design.png');
  const meta = await sharp(imgPath).metadata();
  console.log('Flow image dimensions:', meta.width, 'x', meta.height);
}

inspectFlowImage().catch(console.error);
