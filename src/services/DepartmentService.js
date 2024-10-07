import RepositoryFactory from "../repositories/department/RepositoryFactory.js";

const departmentRepository = RepositoryFactory.getDepartmentRepository();

export const createDepartment = async (departmentData) => {
  return await departmentRepository.createDepartment(departmentData);
};

export const getDepartmentById = async (id) => {
  return await departmentRepository.getDepartmentById(id);
};

export const updateDepartment = async (id, department) => {
  return await departmentRepository.updateDepartment(id, department);
};

export const deleteDepartment = async (id) => {
  return await departmentRepository.deleteDepartment(id);
};

export const getAllDepartments = async (searchParams, limit, offset) => {
  const departments = await departmentRepository.getAllDepartments(
    searchParams,
    limit,
    offset
  );
  const totalItems = await departmentRepository.count(searchParams); // total count for pagination
  return { departments, totalItems };
};

export const findByName = async (name) => {
  return await departmentRepository.findByName(name);
};
