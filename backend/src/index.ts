import app from './app';
import { runMigrations } from './db/migrations';

const PORT = process.env.PORT || 3000;

// Run database migrations
runMigrations();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
