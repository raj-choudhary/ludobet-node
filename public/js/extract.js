const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'ludo_tournament_home_screen.svg');
const content = fs.readFileSync(svgPath, 'utf8');
console.log('SVG Length:', content.length);

const match = content.match(/href="data:image\/png;base64,([^"]+)"/);
if (match) {
    const b64 = match[1];
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(path.join(__dirname, 'extracted_original_ui.png'), buf);
    console.log('Extracted PNG successfully, size:', buf.length);
} else {
    console.log('No embedded base64 png found');
}
