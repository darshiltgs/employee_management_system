import { config } from "../../config.js";
import Employee from "../../models/mongodb/employee.model.js";
import MongoRepository from "../commonrepo/MongoRepository.js";
import MySQLRepository from "../commonrepo/MySQLRepository.js";
import MongoEmployeeRepository from "./MongoEmployeeRepository.js";
import MySQLEmployeeRepository from "./MySQLEmployeeRepository.js";

class RepositoryFactory {
  getEmployeeRepository() {
    if (config.dbType === "mongoose") {
      return new MongoRepository(Employee, "Employee");
    } else if (config.dbType === "mysql") {
      return new MySQLRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
