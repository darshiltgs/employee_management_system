import MongoUserRepository from "../repositories/users/MongoUserRepository.js";
import {
  connectRabbitMQ,
  EXCHANGE_NAME,
  EXCHANGE_TYPE,
  models,
} from "./index.js";

export const authConsumeMessage = async () => {
  try {
    console.log("Running Auth command");
    const { channel } = await connectRabbitMQ();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    const queue = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue.queue, EXCHANGE_NAME, "", {
      "x-match": "all",
      "db-type": "mongodb",
      "method-type": "auth",
    });

    channel.consume(queue.queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log("Data: ", data);

        const mongooseRepo = new MongoUserRepository();
        await mongooseRepo.createUser(data);
      }
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
