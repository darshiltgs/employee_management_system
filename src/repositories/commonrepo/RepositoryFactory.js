import { config } from "../../config.js";
import MongooseRepository from "./MongooseRepository.js";
import MySQLRepository from "../commonrepo/MySQLRepository.js";
import MongoDBRepository from "./MongoDBRepository.js";

class RepositoryFactory {
  getRepositoryFactory(collection, name) {
    if (config.dbType === "mysql") {
      return new MySQLRepository(collection, name);
    } else if (config.dbType === "mongoose") {
      return new MongooseRepository(collection, name);
    } else if (config.dbType === "mongodb") {
      return new MongoDBRepository(collection, name);
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
