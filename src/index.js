import dotenv from 'dotenv';
import { syncDatabase } from './db/index.js';

dotenv.config({
  path: "./.env"
});

syncDatabase();
