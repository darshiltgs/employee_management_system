import { config } from "../../config.js";
import MongoUserRepository from "./MongoUserRepository.js";
import MySQLUserRepository from "./MySQLUserRepository.js";

class RepositoryFactory {
  getUserRepository() {
    if (config.dbType === "mysql") {
      return new MySQLUserRepository();
    } else if (config.dbType === "mongodb") {
      return new MongoUserRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
