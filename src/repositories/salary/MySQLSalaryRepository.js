import Salary from "../../models/sequelize/salary.model.js";
import Employee from "../../models/sequelize/employee.model.js";
import User from "../../models/sequelize/user.model.js";

class MySQLSalaryRepository {
  async createSalary(salaryData) {
    const employeeExist = await this.isEmployeeExist(salaryData.employeeId);
    if (!employeeExist) {
      throw new ApiError(400, "Employee not found");
    }
    return await Salary.create(salaryData);
  }

  async getAllSalaries(search, limit, offset) {
    return await Salary.findAll({
      where: search,
      include: [
        { model: Employee, attributes: ["id", "name"] },
        { model: User, as: "creator", attributes: ["id", "username"] },
        { model: User, as: "updater", attributes: ["id", "username"] },
        { model: User, as: "deleter", attributes: ["id", "username"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  async count(searchParams) {
    return await Salary.count({ where: searchParams });
  }

  async getSalaryById(id) {
    return await Salary.findOne({
      where: { isDeleted: false, id: id },
      include: [
        { model: Employee, attributes: ["id", "name"] },
        { model: User, as: "creator", attributes: ["id", "username"] },
        { model: User, as: "updater", attributes: ["id", "username"] },
        { model: User, as: "deleter", attributes: ["id", "username"] },
      ],
    });
  }

  async updateSalary(id, salaryData) {
    const salary = await this.getSalaryById(id);
    if (!salary) {
      throw new ApiError(404, "Salary not found");
    }
    return await salary.update(salaryData);
  }

  async deleteSalary(id) {
    const salary = await this.getSalaryById(id);
    if (!salary) {
      throw new ApiError(404, "Salary not found");
    }
    return await salary.update({ isDeleted: true, deletedAt: Date.now() });
  }

  async isEmployeeExist(id) {
    return await Employee.findByPk(id);
  }
}

export default MySQLSalaryRepository;
