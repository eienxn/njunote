import db from '../../config/database';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, '../schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

try {
  db.exec(schema);
  console.log('✅ Database schema initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize database schema:', error);
  process.exit(1);
}
