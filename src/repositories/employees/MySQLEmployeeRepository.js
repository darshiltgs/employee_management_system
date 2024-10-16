import Department from "../../models/sequelize/department.model.js";
import Employee from "../../models/sequelize/employee.model.js";
import User from "../../models/sequelize/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

class MySQLEmployeeRepository {
  async createEmployee(employee) {
    const employeeExists = await this.isEmailExist(employee.email);
    if (employeeExists) {
      throw new ApiError(400, "Email already exists");
    }
    const phoneExists = await this.isPhoneExist(employee.phone);
    if (phoneExists) {
      throw new ApiError(400, "Phone number already exists");
    }

    const departmentExists = await this.isDepartmentExist(
      employee.departmentId
    );
    if (!departmentExists) {
      throw new ApiError(400, "Department does not exist");
    }

    return await Employee.create(employee);
  }

  async getAllEmployees(search, limit, offset) {
    return await Employee.findAll({
      where: search,
      include: [
        { model: User, as: "creator", attributes: ["id", "username"] },
        { model: User, as: "updater", attributes: ["id", "username"] },
        { model: User, as: "deleter", attributes: ["id", "username"] },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async count(searchParams) {
    return await Employee.count({ where: searchParams });
  }

  async findEmployeeById(id) {
    return await Employee.findOne(
      {
        where: { id, isDeleted: false },
      },
      {
        include: [
          { model: Department, attributes: ["name"] },
          { model: User, as: "creator", attributes: ["id", "username"] },
          { model: User, as: "updater", attributes: ["id", "username"] },
          { model: User, as: "deleter", attributes: ["id", "username"] },
        ],
      }
    );
  }

  async updateEmployee(id, employeeData) {
    const employee = await Employee.findByPk(id);
    if (!employee) throw new ApiError(404, "Employee not found");
    return await employee.update(employeeData);
  }

  async deleteEmployee(id, deleteData) {
    const employee = await Employee.findByPk(id);
    if (!employee) throw new ApiError(404, "Employee not found");
    return await employee.update(deleteData);
  }

  async isEmailExist(email) {
    return await Employee.findOne({ where: { email } });
  }

  async isPhoneExist(phone) {
    return await Employee.findOne({ where: { phone } });
  }

  async isDepartmentExist(id) {
    return await Department.findOne({ where: { id } });
  }
}

export default MySQLEmployeeRepository;
