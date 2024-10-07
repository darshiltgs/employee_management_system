import RepositoryFactory from "../repositories/salary/RepositoryFactory.js";

const salaryRepository = RepositoryFactory.getSalaryRepository();

export const createSalary = async (salaryData) => {
  return await salaryRepository.createSalary(salaryData);
};

export const getSalaryById = async (id) => {
  return await salaryRepository.getSalaryById(id);
};

export const updateSalary = async (id, salary) => {
  return await salaryRepository.updateSalary(id, salary);
};

export const deleteSalary = async (id) => {
  return await salaryRepository.deleteSalary(id);
};

export const getAllSalaries = async (searchParams, limit, offset) => {
  const salaries = await salaryRepository.getAllSalaries(
    searchParams,
    limit,
    offset
  );

  const totalItems = await salaryRepository.count(searchParams); // total count for pagination
  return { salaries, totalItems };
};
