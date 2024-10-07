import RepositoryFactory from "../repositories/employees/RepositoryFactory.js";

const employeeRepository = RepositoryFactory.getEmployeeRepository();

export const createEmployee = async (employee) => {
  return await employeeRepository.createEmployee(employee);
};

export const getEmployeeById = async (id) => {
  return await employeeRepository.findEmployeeById(id);
};

export const updateEmployee = async (id, employee) => {
  return await employeeRepository.updateEmployee(id, employee);
};

export const deleteEmployee = async (id, deletedData) => {
  console.log(deletedData);
  return await employeeRepository.deleteEmployee(id, deletedData);
};

export const getAllEmployees = async (searchParams, limit, offset) => {
  const employees = await employeeRepository.getAllEmployees(
    searchParams,
    limit,
    offset
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
