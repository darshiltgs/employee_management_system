import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createHashPassword = async (password) => {
  // create a hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const createToken = (email, id) => {
  //create a token
  const token = jwt.sign({ user_id: id, email }, process.env.TOKEN_KEY, {
    expiresIn: "5h",
  });

  return token;
};

export const checkToken = (headers) => {
  if (!headers["authorization"])
    return res.status(401).json({ message: "Token is not provided" });

  const token = headers["authorization"].split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token is not provided" });

  return token;
};
