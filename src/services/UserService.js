import bcryptjs from "bcryptjs";
import { createHashPassword, createToken } from "../utils/helpers.js";
import RepositoryFactory from "../repositories/commonrepo/RepositoryFactory.js";
import { User } from "../models/index.js";
import { config } from "../config.js";

const userRepository = RepositoryFactory.getRepositoryFactory(User, "User");

export const registerUser = async (username, email, password) => {
  const userExist = await userRepository.getOne(User, { username });
  if (userExist) {
    throw new Error("Username already exists");
  }

  const emailExist = await userRepository.getOne(User, { email });
  if (emailExist) {
    throw new Error("Email already exists");
  }

  const encryptedPassword = await createHashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: encryptedPassword,
  });

  const token = createToken(newUser.email, newUser.id);
  newUser.token = token;

  // if (config.dbType === "mongodb") {
  //   await userRepository.updateCollection(newUser._id, newUser);
  // } else {
  await userRepository.saveUser(newUser);
  // }

  return newUser;
};

export const loginUser = async (username, password) => {
  const user = await userRepository.getOne(User, { username });
  if (!user) {
    throw new Error("The username is invalid");
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("The password is invalid");
  }

  const token = createToken(user.email, user.id);
  user.token = token;

  await userRepository.saveUser(user);

  return user;
};

export const logoutUser = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.token = null;
  await userRepository.saveUser(user);
};
