import { connectRabbitMQ, EXCHANGE_NAME, EXCHANGE_TYPE } from "./index.js";

export const publishMessage = async (headers, message) => {
  try {
    const { channel, connection } = await connectRabbitMQ();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    console.log(message);

    channel.publish(EXCHANGE_NAME, "", Buffer.from(JSON.stringify(message)), {
      headers,
      persistent: true,
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error: ", error);
  }
};
