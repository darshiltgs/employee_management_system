import UserMongo from "./mongodb/user.model.js";
import DepartmentMongo from "./mongodb/department.model.js";
import EmployeeMongo from "./mongodb/employee.model.js";
import SalaryMongo from "./sequelize/salary.model.js";
import UserSQL from "./sequelize/user.model.js";
import DepartmentSQL from "./sequelize/department.model.js";
import EmployeeSQL from "./sequelize/employee.model.js";
import SalarySQL from "./sequelize/salary.model.js";
import { config } from "../config.js";
import { connectMongoDB } from "../db/index.js";

const User =
  config.dbType == "mongoose"
    ? UserMongo
    : config.dbType == "mysql"
      ? UserSQL
      : await connectMongoDB().then((db) => db.collection("users"));
const Employee =
  config.dbType == "mongoose"
    ? EmployeeMongo
    : config.dbType == "mysql"
      ? EmployeeSQL
      : "employees";
const Salary =
  config.dbType == "mongoose"
    ? SalaryMongo
    : config.dbType == "mysql"
      ? SalarySQL
      : "salary";
const Department =
  config.dbType == "mongoose"
    ? DepartmentMongo
    : config.dbType == "mysql"
      ? DepartmentSQL
      : "departments";

export { User, Employee, Salary, Department };
