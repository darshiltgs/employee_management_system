import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import departmentRouter from "./routes/department.routes.js";

// define app
const app = express();

// define middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
})); // define cors for where to receive requests
app.use(express.json({
  limit: "16kb"
})); // for get data in json format with limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // for get data from url with limit
app.use(express.static("public")) // save some static files
app.use(cookieParser()); // to parse cookies

app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/departments", departmentRouter);

export { app }