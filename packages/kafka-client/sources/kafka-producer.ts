import { Producer } from 'kafkajs';

import KafkaClient, { KafkaClientOptions } from './kafka-client';

/**
 * Kafka producer that defines state and methods for producing messages to Kafka.
 */
export default class KafkaProducer extends KafkaClient {
  protected producer: Producer;

  public constructor(options: KafkaClientOptions) {
    super(options);
    this.producer = this.kafka.producer(this.options);
  }

  public async init(): Promise<void> {
    await this.producer.connect();
  }
}
