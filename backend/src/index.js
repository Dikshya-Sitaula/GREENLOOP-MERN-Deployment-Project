import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedIfEmpty } from './seed/seed.js';
import { seedCategories } from './services/categoryService.js';

await connectDB();
await seedCategories();
await seedIfEmpty();

app.listen(env.port, () => {
  console.log(`✓ GreenLoop API running on http://localhost:${env.port}`);
});
