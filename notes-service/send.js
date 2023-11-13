const amqp = require('amqplib');

const queueName = "image_processing";

exports.putInQueue = async(message) => {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	await channel.assertQueue(queueName, {
		durable: false,
	});
	channel.sendToQueue(queueName, Buffer.from(message));
	console.log("Message sent");
	setTimeout(() => {
		connection.close();
	}, 500);
};
