import { Department } from "../models/index.js";
import RepositoryFactory from "../repositories/commonrepo/RepositoryFactory.js";

const departmentRepository = RepositoryFactory.getRepositoryFactory(
  Department,
  "Department"
);

export const createDepartment = async (departmentData) => {
  return await departmentRepository.createCollection(departmentData);
};

export const getDepartmentById = async (id) => {
  return await departmentRepository.getCollectionById(id);
};

export const updateDepartment = async (id, department) => {
  return await departmentRepository.updateCollection(id, department);
};

export const deleteDepartment = async (id) => {
  return await departmentRepository.deleteCollection(id);
};

export const getAllDepartments = async (searchParams, limit, offset) => {
  const departments = await departmentRepository.getAllCollections(
    searchParams,
    limit,
    offset
  );
  const totalItems = await departmentRepository.count(searchParams); // total count for pagination
  return { departments, totalItems };
};

export const findByName = async (name) => {
  return await departmentRepository.getOne(Department, name);
};
