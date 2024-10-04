import { User } from "../models/sequelize/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { registerValidation } from "../utils/validations.js";
import { ApiError } from "../utils/ApiError.js";
import { createToken } from "../utils/helpers.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body; // get data from request

  registerValidation(username, email, password, res); // validation errors

  // check if user exists or not
  const userExist = await User.findOne({ where: { username } });
  if (userExist) {
    throw new ApiError(400, "Username already exists");
  }

  const emailExist = await User.findOne({ where: { email } });
  if (emailExist) {
    throw new ApiError(400, "EmailID already exists");
  }

  //create excrypted password
  const encryptedUserPassword = await bcrypt.hash(password, 10);

  //create user
  const newUser = await User.create({
    username,
    email,
    password: encryptedUserPassword,
  });

  const token = createToken(newUser.email, newUser.id); //create token

  newUser.token = token;

  await newUser.save(); // save token into userdata

  res.status(201).json({
    message: 'User created successfully!',
    user: newUser
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // get data from request

  // check if user exists or not
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new ApiError(401, "The username is invalid");
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "The password is invalid");
  }

  const token = createToken(user.email, user.id); //create token

  user.token = token;

  await user.save(); // save token into userdata

  res.status(201).json({
    message: 'User Logged in successfully!',
    user: user
  });
});

export const logout = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id); // get id from request

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.token = null; // null token into userdata

  await user.save(); // save updated userdata

  res.status(200).json({
    message: 'User Logged out successfully!'
  });
});