import { Op } from "sequelize";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as departmentService from "../services/DepartmentService.js";
import { config } from "../config.js";

// create department route : /departments [POST]
export const createDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body; // get department name from request body

  if (!name) {
    throw new ApiError(400, "Please provide a name for the department");
  }

  // check if the department exists or not with the same name
  // const departmentExist = await Department.findOne({
  //   where: { name, isDeleted: false },
  // });
  // if (departmentExist) {
  //   throw new ApiError(400, "Department with the same name already exists");
  // }

  // create department
  // const department = await Department.create({ name, createdBy: req.user.id });

  const departmentt = await departmentService.createDepartment({
    ...req.body,
    createdBy: req.user.id,
  });

  res
    .status(201)
    .json({ message: "Department created successfully!!", departmentt });
});

// get all departments route : /departments [GET]
export const getAllDepartments = asyncHandler(async (req, res) => {
  // get page and limit from query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const offset = (page - 1) * limit; // get the offset
  const { search } = req.query;

  const searchParams = {
    isDeleted: false,
  };

  if (search) {
    if (config.dbType === "mysql") {
      searchParams.name = {
        [Op.like]: `%${search}%`,
      };
    } else {
      searchParams["name"] = { $regex: search, $options: "i" };
    }
  }

  // get all departments
  // const departments = await Department.findAll({
  //   where: searchParams,
  //   include: [
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  //   limit,
  //   offset,
  //   order: [["createdAt", "DESC"]],
  // });
  const { departments, totalItems } = await departmentService.getAllDepartments(
    search,
    limit,
    offset
  );

  // get totalPages
  const totalPages = Math.ceil(totalItems / limit);

  if (!departments) {
    throw new ApiError(404, "Departments not found");
  }

  res.status(201).json({
    message: "All departments fetched successfully!!",
    departments,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: departments.length,
    },
  });
});

// get department by id route : /departments/:id [GET]
export const getDepartmentById = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Department id not found");

  // get department by id
  // const department = await Department.findOne({
  //   where: { id: req.params.id, isDeleted: false },
  //   include: [
  //     { model: User, as: "creator", attributes: ["id", "username"] },
  //     { model: User, as: "updater", attributes: ["id", "username"] },
  //     { model: User, as: "deleter", attributes: ["id", "username"] },
  //   ],
  // });
  const department = await departmentService.getDepartmentById(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  res
    .status(200)
    .json({ message: "Department fetched successfully!!", department });
});

// update department route : /departments/:id [PUT]
export const updateDepartment = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Department id not found");

  const { name } = req.body; // get department name from request body

  if (!name) {
    throw new ApiError(400, "Please provide a name for the department");
  }

  // check if the department exists or not with the same id
  const departmentExist = await departmentService.getDepartmentById(
    req.params.id
  );
  if (!departmentExist) throw new ApiError(404, "Department not found");

  // check if the department exists or not with the same name
  const departmentNameExist = await departmentService.findByName(name);
  if (departmentNameExist) {
    throw new ApiError(400, "Department with the same name already exists");
  }

  // update department
  // departmentExist.name = name;
  // departmentExist.updatedAt = Date.now();
  // departmentExist.updatedBy = req.user.id;
  // await departmentExist.save();
  const updatedDepartment = await departmentService.updateDepartment(
    req.params.id,
    {
      name,
      updatedBy: req.user.id,
      updatedAt: Date.now(),
    }
  );

  res
    .status(200)
    .json({ message: "Department updated successfully!!", updatedDepartment });
});

// delete department route : /departments/:id [DELETE]
export const deleteDepartment = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new ApiError(404, "Department id not found");

  // const department = await Department.findByPk(req.params.id); //get department

  // if (!department) {
  //   throw new ApiError(404, "Department not found");
  // }
  const department = await departmentService.getDepartmentById(req.params.id);
  if (!department) throw new ApiError(404, "Department not found");

  // update department
  // department.isDeleted = true;
  // department.deletedAt = Date.now();
  // department.deletedBy = req.user.id;
  // await department.save();
  await departmentService.deleteDepartment(req.params.id, {
    isDeleted: true,
    deletedBy: req.user.id,
    deletedAt: Date.now(),
  });

  res.status(201).json({ message: "Department deleted successfully!!" });
});
