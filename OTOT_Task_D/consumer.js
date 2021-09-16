const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const topicName = "orderCreated";
const consumerNumber = process.argv[2] || "1";

const processConsumer = async () => {
  const ordersConsumer = kafka.consumer({ groupId: "orders" });
  const paymentsConsumer = kafka.consumer({ groupId: "payments" });
  const notificationsConsumer = kafka.consumer({ groupId: "notifications" });
  await Promise.all([
    ordersConsumer.connect(),
    paymentsConsumer.connect(),
    notificationsConsumer.connect(),
  ]);

  await Promise.all([
    await ordersConsumer.subscribe({ topic: topicName }),
    await paymentsConsumer.subscribe({ topic: topicName }),
    await notificationsConsumer.subscribe({ topic: topicName }),
  ]);

  let orderCounter = 1;
  let paymentCounter = 1;
  let notificationCounter = 1;
  await ordersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        orderCounter,
        `ordersConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      orderCounter++;
    },
  });
  await paymentsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        paymentCounter,
        `paymentsConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      paymentCounter++;
    },
  });
  await notificationsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        notificationCounter,
        `notificationsConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      notificationCounter++;
    },
  });
};

const logMessage = (counter, consumerName, topic, partition, message) => {
  console.log(
    `received a new message number: ${counter} on ${consumerName}: `,
    {
      topic,
      partition,
      message: {
        offset: message.offset,
        headers: message.headers,
        value: message.value.toString(),
      },
    }
  );
};

processConsumer();
