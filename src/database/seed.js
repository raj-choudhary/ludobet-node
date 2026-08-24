const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runSeeds() {
  console.log('🌱 [SEEDER] Starting Database Seeding (Admin + Bots + Platform Rules)...');
  const seedPath = path.join(__dirname, 'seed.sql');
  
  if (!fs.existsSync(seedPath)) {
    console.error('❌ seed.sql file not found!');
    return false;
  }

  const sqlContent = fs.readFileSync(seedPath, 'utf-8');
  const statements = sqlContent
    .replace(/--.*$/gm, '')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));

  try {
    for (const statement of statements) {
      if (statement.length > 5) {
        await db.query(statement);
      }
    }
    console.log('✅ [SEEDER] Super Admin, 10 Bot Personas & Platform Rules Seeded Successfully.');
    return true;
  } catch (error) {
    console.error('❌ [SEEDER FAILED]:', error.message);
    return false;
  }
}

if (require.main === module) {
  runSeeds().then(() => process.exit(0));
}

module.exports = { runSeeds };
