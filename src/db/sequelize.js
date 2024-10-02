import { Sequelize } from "sequelize";
import { DB_NAME } from "../constants.js";

export const sequelize = new Sequelize(DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST,
});