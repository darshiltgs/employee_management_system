import { config } from "../../config.js";
import Department from "../../models/mongodb/deparment.model.js";
import MongoRepository from "../commonrepo/MongoRepository.js";
import MySQLRepository from "../commonrepo/MySQLRepository.js";
import MongoDepartmentRepository from "./MongoDeparmentRepository.js";
import MySQLDepartmentRepository from "./MySQLDeparmentRepository.js";

class RepositoryFactory {
  getDepartmentRepository() {
    if (config.dbType === "mongoose") {
      return new MongoRepository(Department, "Document");
    } else if (config.dbType === "mysql") {
      return new MySQLRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
