import { app } from "./app.js";
import { sequelize } from "./db/sequelize.js";
import dotenv from 'dotenv';

dotenv.config({
  path: "./.env"
});

const startServer = async () => {
  try {
    await sequelize.sync(); // Wait for the database to sync
    console.log("Database & Tables Created!");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database Creation Failed:", error);
  }
};

// Start the server
startServer();