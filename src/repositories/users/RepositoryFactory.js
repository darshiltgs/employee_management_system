import { config } from "../../config.js";
import MongooseRepository from "../commonrepo/MongooseRepository.js";
import MySQLRepository from "../commonrepo/MySQLRepository.js";

class RepositoryFactory {
  getUserRepository() {
    if (config.dbType === "mysql") {
      return new MySQLRepository();
    } else if (config.dbType === "mongoose") {
      return new MongooseRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
