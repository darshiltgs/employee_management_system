import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

export const addUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({ where: { username: username } });

  if (userExist) {
    throw new ApiError(400, "Username already exists");
  }

  const encryptedUserPassword = await bcrypt.hash(password, 10);

  console.log(encryptedUserPassword);

  const newUser = await User.create({
    username,
    email,
    password: encryptedUserPassword,
  });

  res.status(201).json({
    message: 'Employee created successfully!',
    user: newUser
  });
});