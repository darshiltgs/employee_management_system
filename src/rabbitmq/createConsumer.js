import MongooseRepository from "../repositories/commonrepo/MongooseRepository.js";
import {
  connectRabbitMQ,
  EXCHANGE_NAME,
  EXCHANGE_TYPE,
  models,
} from "./index.js";

export const consumeMessage = async () => {
  try {
    console.log("Running crud command");
    const { channel } = await connectRabbitMQ();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    const queue = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue.queue, EXCHANGE_NAME, "", {
      "x-match": "all",
      "db-type": "mongodb",
      "method-type": "create",
    });

    channel.consume(queue.queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(data);

        const model = models[data.collection];

        const mongooseRepo = new MongooseRepository(model, data.collection);
        await mongooseRepo.createCollection(data);
      }
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
