import { config } from "../../config.js";
import Salary from "../../models/mongodb/salary.model.js";
import MongoRepository from "../commonrepo/MongoRepository.js";
import MySQLRepository from "../commonrepo/MySQLRepository.js";
import MySQLSalaryRepository from "./MySQLSalaryRepository.js";

class RepositoryFactory {
  getSalaryRepository() {
    if (config.dbType === "mongoose") {
      return new MongoRepository(Salary, "Salary");
    } else if (config.dbType === "mysql") {
      return new MySQLRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }
}

export default new RepositoryFactory();
