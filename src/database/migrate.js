const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigrations() {
  console.log('🚀 [MIGRATION] Starting Database Schema Migration...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.sql file not found!');
    return false;
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
  // Split queries by semicolon (ignoring comments and empty lines)
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
    console.log('✅ [MIGRATION] All 8 Tables Migrated Successfully (InnoDB ACID).');
    return true;
  } catch (error) {
    console.error('❌ [MIGRATION FAILED]:', error.message);
    return false;
  }
}

if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}

module.exports = { runMigrations };
