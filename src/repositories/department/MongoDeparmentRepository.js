import Department from "../../models/mongodb/deparment.model.js";
import { ApiError } from "../../utils/ApiError.js";

class MongoDepartmentRepository {
  async createDepartment(departmentData) {
    const department = await Department.findOne({
      name: departmentData.name,
    }).where({ isDeleted: false });
    if (department)
      throw new ApiError(400, "Department with the same name already exists");
    return await Department.create(departmentData);
  }

  async getAllDepartments(searchParams, limit, offset) {
    return await Department.find(searchParams)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("createdBy", "username") // Populate createdBy field with the user's username and email
      .populate("updatedBy", "username") // Populate updatedBy field
      .populate("deletedBy", "username");
  }

  async getDepartmentById(departmentId) {
    return await Department.findById(departmentId)
      .where({ isDeleted: false })
      .populate("createdBy", "username") // Populate createdBy field with the user's username and email
      .populate("updatedBy", "username") // Populate updatedBy field
      .populate("deletedBy", "username");
  }

  async count(searchParams) {
    return await Department.countDocuments(searchParams);
  }

  async findByName(name) {
    return await Department.findOne({ name, isDeleted: false });
  }

  async updateDepartment(id, departmentData) {
    const department = await Department.findById(id);
    if (!department) throw new ApiError(400, "Department not found");
    return await Department.findByIdAndUpdate(id, departmentData, {
      new: true,
    });
  }

  async deleteDepartment(id, userid) {
    const department = await Department.findById(id);
    if (!department) throw new ApiError(400, "Department not found");
    return await Department.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy: userid,
      },
      { new: false }
    );
  }
}

export default MongoDepartmentRepository;
