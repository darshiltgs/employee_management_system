import { config } from "../../config.js";
import MongoSalaryRepository from "./MongoSalaryRepository.js";
import MySQLSalaryRepository from "./MySQLSalaryRepository.js";

class RepositoryFactory {
  getSalaryRepository() {
    if (config.dbType === "mongodb") {
      return new MongoSalaryRepository();
    } else if (config.dbType === "mysql") {
      return new MySQLSalaryRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
