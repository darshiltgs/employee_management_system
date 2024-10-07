import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  Department,
  Employee,
  Salary,
  User,
} from "../models/sequelize/index.js";
import { Op } from "sequelize";
import * as salaryServices from "../services/SalaryService.js";
import { config } from "../config.js";

// create salary route : /salary [POST]
export const createSalary = asyncHandler(async (req, res) => {
  const { employeeId, salary, date } = req.body;

  if (!employeeId || !salary || !date) {
    throw new ApiError(400, "All fields are required");
  }

  if (salary < 0) {
    throw new ApiError(400, "Salary should be a positive number");
  }

  // check if the employee exists or not
  // const employeeExist = await Employee.findByPk(employeeId);
  // if (!employeeExist) {
  //   throw new ApiError(400, "Employee does not exist");
  // }

  // create salary
  // const newSalary = await Salary.create({
  //   employeeId,
  //   salary,
  //   date,
  //   createdBy: req.user.id,
  // });

  const newSalary = await salaryServices.createSalary({
    employeeId,
    salary,
    date,
    createdBy: req.user.id,
  });

  res.status(201).json({ message: "Salary created successfully!!", newSalary });
});

// get all salaries route : /salary [GET]
export const getAllSalaries = asyncHandler(async (req, res) => {
  // get page and limit from query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const offset = (page - 1) * limit; // get the offset

  const { employeeId, minSalary, maxSalary } = req.query;

  const filterParams = {
    isDeleted: false,
  };

  if (config.dbType === "mysql") {
    if (minSalary) {
      filterParams.salary = {
        [Op.gte]: minSalary,
      };
    }

    if (maxSalary) {
      filterParams.salary = {
        [Op.lte]: maxSalary,
      };
    }
  }

  if (config.dbType === "mongodb") {
    if (minSalary) {
      filterParams.salary = { $gte: minSalary }; // Greater than or equal to
    }

    if (maxSalary) {
      filterParams.salary = { ...filterParams.salary, $lte: maxSalary }; // Less than or equal to
    }
  }

  if (employeeId) {
    filterParams.employeeId = employeeId;
  }

  // get all salaries
  // const salaries = await Salary.findAll({
  //   where: filterParams,
  //   include: [
  //     { model: Employee, attributes: ["id", "name"] },
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  //   order: [["createdAt", "DESC"]],
  //   limit,
  //   offset,
  // });
  const { salaries, totalItems } = await salaryServices.getAllSalaries(
    filterParams,
    limit,
    offset
  );

  // check if salaries exist
  if (!salaries) throw new ApiError(404, "No salaries found");

  // get totalPages
  const totalPages = Math.ceil(totalItems / limit);

  res.status(201).json({
    message: "Salaries fetched successfully!!",
    salaries: salaries,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalItems,
    },
  });
});

// get salary by id route : /salary/:id [GET]
export const getSalaryById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Salary id not found");

  // get salary by id
  // const salary = await Salary.findOne({
  //   where: { isDeleted: false, id: req.params.id },
  //   include: [
  //     { model: Employee, attributes: ["id", "name"] },
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  // });
  const salary = await salaryServices.getSalaryById(req.params.id);

  if (!salary) throw new ApiError(404, "Salary not found");

  res.status(200).json({ message: "Salary fetched successfully!!", salary });
});

// update salary route : /salary/:id [PUT]
export const updateSalary = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Salary id not found");

  const { salary, date } = req.body;

  if (!salary || !date) {
    throw new ApiError(400, "All fields are required");
  }

  if (salary < 0) {
    throw new ApiError(400, "Salary should be a positive number");
  }

  // get salary by id
  const salaryExist = await salaryServices.getSalaryById(req.params.id);
  if (!salaryExist) {
    throw new ApiError(400, "Salary does not exist");
  }

  // // update salary
  // salaryExist.salary = salary;
  // salaryExist.date = date;
  // salaryExist.updatedBy = req.user.id;
  // await salaryExist.save();
  const newSalary = await salaryServices.updateSalary(req.params.id, {
    salary,
    date,
    updatedBy: req.user.id,
  });

  res.status(201).json({ message: "Salary updated successfully!!", newSalary });
});

// delete salary route : /salary/:id [DELETE]
export const deleteSalary = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Salary id not found");

  const salaryExist = await salaryServices.getSalaryById(req.params.id);
  if (!salaryExist) {
    throw new ApiError(400, "Salary does not exist");
  }

  // delete salary
  // salaryExist.isDeleted = true;
  // salaryExist.deletedAt = Date.now();
  // salaryExist.deletedBy = req.user.id;
  // await salaryExist.save();
  await salaryServices.updateSalary(req.params.id, {
    isDeleted: true,
    deletedAt: Date.now(),
    deletedBy: req.user.id,
  });

  res.status(201).json({ message: "Salary deleted successfully!!" });
});

// get salaries by employee route : /salary/employee/:id [GET]
export const getSalariesByEmployee = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Employee id not found");

  const employeeExist = await Employee.findByPk(req.params.id);
  if (!employeeExist) {
    throw new ApiError(400, "Employee does not exist");
  }

  const salaries = await Salary.findAll({
    where: { isDeleted: false, employeeId: req.params.id },
    include: [
      {
        model: Employee,
        attributes: ["id", "name"],
        include: [
          {
            model: Department,
            attributes: ["name"], // Include the department name
          },
        ],
      },
      { model: User, as: "creator", attributes: ["id", "username"] },
      { model: User, as: "updater", attributes: ["id", "username"] },
      { model: User, as: "deleter", attributes: ["id", "username"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json({ message: "Salaries fetched successfully!!", salaries });
});
