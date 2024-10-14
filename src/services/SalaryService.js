import EmployeeMongo from "../models/mongodb/employee.model.js";
import EmployeeSQL from "../models/sequelize/employee.model.js";
import RepositoryFactory from "../repositories/commonrepo/RepositoryFactory.js";
import { ApiError } from "../utils/ApiError.js";
import { Employee, Salary } from "../models/index.js";

const salaryRepository = RepositoryFactory.getRepositoryFactory(
  Salary,
  "Salary"
);

export const createSalary = async (salaryData) => {
  const employeeExist = await salaryRepository.getById(
    Employee,
    salaryData.employeeId
  );
  if (!employeeExist) {
    throw new ApiError(400, "Employee not found");
  }
  return await salaryRepository.createCollection(salaryData);
};

export const getSalaryById = async (id) => {
  return await salaryRepository.getCollectionById(id);
};

export const updateSalary = async (id, salary) => {
  return await salaryRepository.updateCollection(id, salary);
};

export const deleteSalary = async (id) => {
  return await salaryRepository.deleteCollection(id);
};

export const getAllSalaries = async (searchParams, limit, offset) => {
  const salaries = await salaryRepository.getAllCollections(
    searchParams,
    limit,
    offset
  );

  const totalItems = await salaryRepository.count(searchParams); // total count for pagination
  return { salaries, totalItems };
};
