import dotenv from 'dotenv';
import { syncDatabase } from './db/index.js';
import { User } from "./models/index.js";

dotenv.config({
  path: "./.env"
});

syncDatabase();
