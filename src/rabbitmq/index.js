import amqp from "amqplib";
import Department from "../models/mongodb/department.model.js";
import Employee from "../models/mongodb/employee.model.js";
import Salary from "../models/mongodb/salary.model.js";
export const EXCHANGE_NAME = "mongoExchange";
export const QUEUE_NAME = "mongoQueue";
export const EXCHANGE_TYPE = "headers";

export const models = {
  Employee,
  Department,
  Salary,
};

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  return { channel, connection };
};
