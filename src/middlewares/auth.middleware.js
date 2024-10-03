import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findByPk(decoded.user_id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(403, 'Token is not valid');
  }
});