import bcryptjs from "bcryptjs";
import RepositoryFactory from "../repositories/users/RepositoryFactory.js";
import { createHashPassword, createToken } from "../utils/helpers.js";

const userRepository = RepositoryFactory.getUserRepository();

export const registerUser = async (username, email, password) => {
  const userExist = await userRepository.findUserByUsername(username);
  if (userExist) {
    throw new Error("Username already exists");
  }

  const emailExist = await userRepository.findUserByEmail(email);
  if (emailExist) {
    throw new Error("Email already exists");
  }

  const encryptedPassword = await createHashPassword(password);
  const newUser = await userRepository.createUser({
    username,
    email,
    password: encryptedPassword,
  });

  const token = createToken(newUser.email, newUser.id);
  newUser.token = token;

  await userRepository.saveUser(newUser);

  return newUser;
};

export const loginUser = async (username, password) => {
  const user = await userRepository.findUserByUsername(username);
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
