import { config } from "../../config.js";
import MongoDepartmentRepository from "./MongoDeparmentRepository.js";
import MySQLDepartmentRepository from "./MySQLDeparmentRepository.js";

class RepositoryFactory {
  getDepartmentRepository() {
    console.log("Type: " + config.dbType);
    if (config.dbType === "mongodb") {
      return new MongoDepartmentRepository();
    } else if (config.dbType === "mysql") {
      return new MySQLDepartmentRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
