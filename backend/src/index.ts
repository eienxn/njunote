import app from './app';
import db from './config/database';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;

// Initialize database schema
const schemaPath = path.join(__dirname, 'db/schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('✅ Database schema initialized');
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
