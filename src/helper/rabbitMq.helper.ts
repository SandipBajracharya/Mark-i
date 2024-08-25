import amqp from 'amqp-connection-manager';

export async function clearQueue(queueName: string) {
  try {
    // Connect to RabbitMQ server
    const connection = amqp.connect([process.env.RABBITMQ_URI]);
    const channel = connection.createChannel();

    // Purge the queue
    await channel.purgeQueue(queueName);

    console.log(`Queue ${queueName} has been cleared.`);

    // Close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error clearing queue:', error);
  }
}
