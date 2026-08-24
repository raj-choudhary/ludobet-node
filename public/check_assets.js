const fs = require('fs');
const path = require('path');

// Let's inspect png sizes
function getPngDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(24);
  fs.readSync(fd, buffer, 0, 24, 0);
  fs.closeSync(fd);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir);
files.forEach(f => {
  if (f.endsWith('.png')) {
    const dim = getPngDimensions(path.join(assetsDir, f));
    console.log(f, dim);
  }
});
