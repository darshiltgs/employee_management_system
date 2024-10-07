import { config } from "../config.js";
import User from "../models/sequelize/user.model.js";
import RepositoryFactory from "../repositories/users/RepositoryFactory.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const userRepository = RepositoryFactory.getUserRepository();

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await userRepository.findUserById(decoded.user_id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(403, "Token is not valid");
  }
});
