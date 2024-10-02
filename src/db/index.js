import { Sequelize } from "sequelize";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";

const sequelize = new Sequelize(DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST,
});

export const syncDatabase = () => {
  sequelize.sync().then(() => {
    console.log("Database & Tables Created!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT} port`);
    })
  }).catch((err) => {
    console.log("Database Creation Failed: " + err)
  });
}

export default sequelize;