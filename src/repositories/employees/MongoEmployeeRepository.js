import Department from "../../models/mongodb/deparment.model.js";
import Employee from "../../models/mongodb/employee.model.js";

class MongoEmployeeRepository {
  async createEmployee(data) {
    const employeeExists = await this.isEmailExist(data.email);
    if (employeeExists) {
      throw new Error("Email already exists");
    }

    const phoneExists = await this.isPhoneExist(data.phone);
    if (phoneExists) {
      throw new Error("Phone number already exists");
    }

    const departmentExists = await this.isDepartmentExist(data.departmentId);
    if (!departmentExists) {
      throw new Error("Department does not exist");
    }

    return await Employee.create(data);
  }

  async count(searchParams) {
    return await Employee.countDocuments(searchParams);
  }

  async getAllEmployees(search, limit, offset) {
    return await Employee.find(search)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("departmentId", "id");
  }

  async findEmployeeById(id) {
    return await Employee.findById(id)
      .where({ isDeleted: false })
      .populate("departmentId", "id");
  }

  async updateEmployee(id, data) {
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  async deleteEmployee(id, data) {
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  async isEmailExist(email) {
    return await Employee.findOne({ email }).where({ isDeleted: false });
  }

  async isPhoneExist(phone) {
    return await Employee.findOne({ phone }).where({ isDeleted: false });
  }

  async isDepartmentExist(id) {
    return await Department.findById(id).where({ isDeleted: false });
  }
}

export default MongoEmployeeRepository;
