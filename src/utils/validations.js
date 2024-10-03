import { ApiError } from "./ApiError.js";

export const registerValidation = (username, email, password, next) => {
  var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
    // res.status(400).json({
    //   success: false,
    //   message: 'All fields are required',
    // });
  }
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email");
    // res.status(400).json({
    //   success: false,
    //   message: 'Please enter a valid email',
    // });
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password should be at least 6 characters long");
    // res.status(400).json({
    //   success: false,
    //   message: 'Please enter a valid email',
    // });
  }
};

