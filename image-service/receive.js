const amqp = require('amqplib');

const queueName = "image_processing";

(async() => {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	await channel.assertQueue(queueName, {durable: false,});

	await channel.consume(queueName, async (msg) => {
		const noteId =  msg.content.toString();
		console.log("[x] Received image-id: ", noteId);
		try {
			// upload image to cloud
			const res = await fetch("http://localhost:9001/createURL", {
				method: "POST",
				body: JSON.stringify({
					"noteId":  noteId,
				}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			const url = await res.text();
			// upload URL to db
			await fetch("http://localhost:9001/insertURL", {
				method: "POST",
				body: JSON.stringify({
					"imgUrl": url,
					"noteId": noteId,
				}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			// delete base64 entry
			await fetch("http://localhost:9001/delete64", {
				method: "POST",
				body: JSON.stringify({
					"noteId": noteId,
				}),
				headers: {
					"Content-Type": "application/json",
				}
			})
		}
		catch(e) {
			console.log(e);
		}
	}, {noAck: true})
})()