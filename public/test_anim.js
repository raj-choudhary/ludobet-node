const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testSharpAnimation() {
  console.log('Sharp formats:', sharp.format);
}

testSharpAnimation().catch(console.error);
