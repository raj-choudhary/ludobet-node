const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Inspecting workspace...');
try {
  const zips = ['ludo_tournament_home_final_assets.zip', 'ludo_tournament_home_working_code.zip'];
  zips.forEach(z => {
    if (fs.existsSync(z)) {
      console.log('Found zip:', z, fs.statSync(z).size);
    }
  });
} catch(e) {
  console.error(e);
}
