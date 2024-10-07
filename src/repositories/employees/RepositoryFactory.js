import { config } from "../../config.js";
import MongoEmployeeRepository from "./MongoEmployeeRepository.js";
import MySQLEmployeeRepository from "./MySQLEmployeeRepository.js";

class RepositoryFactory {
  getEmployeeRepository() {
    if (config.dbType === "mongodb") {
      return new MongoEmployeeRepository();
    } else if (config.dbType === "mysql") {
      return new MySQLEmployeeRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
