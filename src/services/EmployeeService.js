import RepositoryFactory from "../repositories/commonrepo/RepositoryFactory.js";
import { Employee } from "../models/index.js";

const employeeRepository = RepositoryFactory.getRepositoryFactory(
  Employee,
  "Employee"
);

export const createEmployee = async (employee) => {
  return await employeeRepository.createCollection(employee);
};

export const getEmployeeById = async (id) => {
  return await employeeRepository.getCollectionById(id);
};

export const updateEmployee = async (id, employee) => {
  return await employeeRepository.updateCollection(id, employee);
};

export const deleteEmployee = async (id, deletedData) => {
  return await employeeRepository.deleteCollection(id, deletedData);
};

export const getAllEmployees = async (searchParams, limit, offset) => {
  const employees = await employeeRepository.getAllCollections(
    searchParams,
    limit,
    offset,
    ["departmentId", "id"]
  );
  const totalItems = await employeeRepository.count(searchParams); // total count for pagination
  return { employees, totalItems };
};

export const isEmailExist = async (email) => {
  return await employeeRepository.isEmailExist(email);
};

export const isPhoneExist = async (phone) => {
  return await employeeRepository.isPhoneExist(phone);
};

export const isDepartmentExist = async (id) => {
  return await employeeRepository.isDepartmentExist(id);
};
