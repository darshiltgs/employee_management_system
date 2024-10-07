import { app } from "./app.js";
import { config } from "./config.js";
import connectDB from "./db/index.js";
import { sequelize } from "./db/sequelize.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const startServer = async () => {
  try {
    await sequelize.sync({ force: true }); // Wait for the database to sync
    console.log("Database & Tables Created!");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database Creation Failed:", error);
  }
};

// Start the server
if (config.dbType === "mysql") {
  startServer();
} else {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log("MONGO db connection failed !!! ", err);
    });
}
