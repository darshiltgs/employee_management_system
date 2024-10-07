import Department from "../../models/sequelize/department.model.js";
import { ApiError } from "../../utils/ApiError.js";

class MySQLDepartmentRepository {
  async createDepartment(departmentData) {
    const department = await Department.findOne({
      where: { name: departmentData.name },
    });
    if (department)
      throw new ApiError(400, "Department with the same name already exists");
    return await Department.create(departmentData);
  }

  async getAllDepartments(search, limit, offset) {
    return await Department.findAll({
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
    return await Department.count({
      where: searchParams,
    });
  }

  async findByName(name) {
    return await Department.findOne({
      where: { name, isDeleted: false },
    });
  }

  async getDepartmentById(departmentId) {
    return await Department.findOne({
      where: { id: departmentId, isDeleted: false },
      include: [
        { model: User, as: "creator", attributes: ["id", "username"] },
        { model: User, as: "updater", attributes: ["id", "username"] },
        { model: User, as: "deleter", attributes: ["id", "username"] },
      ],
    });
  }

  async updateDepartment(id, departmentData) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");
    return await department.update(departmentData);
  }

  async deleteDepartment(id, deleteData) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");
    return await department.update(deleteData);
  }
}

export default MySQLDepartmentRepository;
