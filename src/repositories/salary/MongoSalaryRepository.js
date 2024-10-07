import Employee from "../../models/mongodb/employee.model.js";
import Salary from "../../models/mongodb/salary.model.js";
import { ApiError } from "../../utils/ApiError.js";

class MongoSalaryRepository {
  async createSalary(salaryData) {
    const employeeExist = await this.isEmployeeExist(salaryData.employeeId);
    if (!employeeExist) {
      throw new ApiError(400, "Employee not found");
    }
    return await Salary.create(salaryData);
  }

  async getSalaryById(id) {
    const salary = await Salary.findById(id).where({ isDeleted: false });
    if (!salary) throw new ApiError(404, "Salary not found");
    return salary;
  }

  async updateSalary(id, salaryData) {
    const salary = await Salary.findByIdAndUpdate(id, salaryData, {
      new: true,
    }).where({ isDeleted: false });
    if (!salary) throw new ApiError(404, "Salary not found");
    return salary;
  }

  async deleteSalary(id) {
    const salary = await Salary.findByIdAndDelete(id).where({
      isDeleted: false,
    });
    if (!salary) throw new ApiError(404, "Salary not found");
    return salary;
  }

  async getAllSalaries(searchParams, limit, offset) {
    const salaries = await Salary.find(searchParams).limit(limit).skip(offset);
    return salaries;
  }

  async count(searchParams) {
    return await Salary.countDocuments(searchParams);
  }

  async isEmployeeExist(id) {
    return await Employee.findById(id);
  }
}

export default MongoSalaryRepository;
