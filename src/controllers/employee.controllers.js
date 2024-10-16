import { Op } from "sequelize";
import { Department, Employee, User } from "../models/sequelize/index.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as employeeServices from "../services/EmployeeService.js";
import { config } from "../config.js";

// create employee route : /employees [POST]
export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, phone, gender, dob, departmentId } = req.body;

  if (!name || !email || !phone || !gender || !dob) {
    throw new ApiError(400, "All fields are required");
  }

  // check if the employee exists or not with email
  // const emailExist = await Employee.findOne({ where: { email } });
  // if (emailExist) {
  //   throw new ApiError(400, "Email already exists");
  // }

  // check if the employee exists or not with phone number
  // const phoneExist = await Employee.findOne({ where: { phone } });
  // if (phoneExist) {
  //   throw new ApiError(400, "Phone already exists");
  // }

  // check department if it exists or not
  // const departmentExist = await Department.findByPk(departmentId);
  // if (!departmentExist) {
  //   throw new ApiError(400, "Department does not exist");
  // }

  // create employee
  const employee = await employeeServices.createEmployee({
    name,
    email,
    phone,
    gender,
    dob,
    departmentId,
    createdBy: req.user.id,
  });

  res
    .status(201)
    .json({ message: "Employee created successfully!!", employee });
});

// get all employees route : /employees [GET]
export const getAllEmployees = asyncHandler(async (req, res) => {
  // get page and limit from query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit; // get the offset
  const { search, departmentId, gender } = req.query;

  const searchFilterParams = {
    isDeleted: false,
  };

  if (search) {
    if (config.dbType === "mysql") {
      searchFilterParams[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    } else {
      searchFilterParams["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
  }

  if (departmentId) {
    searchFilterParams.departmentId = departmentId;
  }

  if (gender) {
    searchFilterParams.gender = gender;
  }

  // get all employees with pagination
  // const employees = await Employee.findAll({
  //   where: searchFilterParams,
  //   include: [
  //     { model: Department, attributes: ["name"] },
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  //   limit,
  //   offset,
  //   order: [["createdAt", "DESC"]],
  // });

  const { employees, totalItems } = await employeeServices.getAllEmployees(
    searchFilterParams,
    limit,
    offset
  );

  // get totalPages
  const totalPages = Math.ceil(totalItems / limit);

  if (!employees) {
    throw new ApiError(404, "Employees not found");
  }

  res.status(201).json({
    message: "All employees fetched successfully!!",
    employees,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalItems,
    },
  });
});

// get employee by id route : /employees/:id [GET]
export const getEmployeeById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Employee id not found");

  // const employee = await Employee.findOne({
  //   where: { id: req.params.id, isDeleted: false },
  //   include: [
  //     { model: Department, attributes: ["name"] },
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  // });
  const employee = await employeeServices.getEmployeeById(req.params.id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  res
    .status(201)
    .json({ message: "Employee fetched successfully!!", employee });
});

// update employee route : /employees/:id [PUT]
export const updateEmployee = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Employee id not found");

  const { name, email, phone, gender, dob, departmentId } = req.body;

  const employee = await employeeServices.getEmployeeById(req.params.id);
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (email && email !== employee.email) {
    // check if the new email exists or not with other employee
    const emailExist = await employeeServices.isEmailExist(email);
    if (emailExist) {
      throw new ApiError(400, "Email already exists");
    }
  }

  if (phone && phone !== employee.phone) {
    // check if the new phone number exists or not with
    const phoneExist = await employeeServices.isPhoneExist(phone);
    if (phoneExist) {
      throw new ApiError(400, "Phone already exists");
    }
  }

  // check department if it exists or not
  if (departmentId) {
    const department = await employeeServices.isDepartmentExist(departmentId);
    if (!department) {
      throw new ApiError(404, "Department does not exist");
    }
  }

  // await employee.update({
  //   name,
  //   email,
  //   phone,
  //   gender,
  //   dob,
  //   departmentId,
  //   updatedBy: req.user.id,
  // });

  const newEmp = await employeeServices.updateEmployee(req.params.id, {
    name,
    email,
    phone,
    gender,
    dob,
    departmentId,
    updatedBy: req.user.id,
  });

  res.status(201).json({ message: "Employee updated successfully!!", newEmp });
});

// delete employee route : /employees/:id [DELETE]
export const deleteEmployee = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Employee id not found");

  const employee = await employeeServices.getEmployeeById(req.params.id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  // await employee.update({ isDeleted: true, deletedAt: Date.now() });
  await employeeServices.deleteEmployee(req.params.id, {
    isDeleted: true,
    deletedAt: Date.now(),
    deletedBy: req.user.id,
  });
  res.status(201).json({ message: "Employee deleted successfully!!" });
});

// get employees by department route : /employees/department/:id [GET]
export const getEmployeesByDepartment = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Department id not found");

  const department = await employeeServices.isDepartmentExist(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  // const employees = await Employee.findAll({
  //   where: { departmentId: req.params.id, isDeleted: false },
  //   include: [
  //     { model: Department, attributes: ["name"] },
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  // });
  const { employees } = await employeeServices.getAllEmployees({
    departmentId: req.params.id,
    isDeleted: false,
  });

  if (!employees) {
    throw new ApiError(404, "Employees not found in this department");
  }

  res
    .status(201)
    .json({ message: "Employees fetched successfully!!", employees });
});
