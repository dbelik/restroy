import { CompressionTypes, Producer, RecordMetadata } from 'kafkajs';

import KafkaClientError, { KafkaClientErrorCode } from './client-error';
import KafkaClient, { KafkaClientOptions, KafkaClientState } from './kafka-client';

export interface Message {
  key?: string;
  value: string;
}

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

  public async send(topic: string, allMessages: Message | Message[]): Promise<RecordMetadata[]> {
    const messages = Array.isArray(allMessages) ? allMessages : [allMessages];

    try {
      const result = await this.producer.send({
        topic,
        messages,
        compression: CompressionTypes.GZIP,
      });
      return result;
    } catch (error) {
      throw new KafkaClientError(
        KafkaClientErrorCode.KAFKA_CLIENT_FAILED_TO_SEND_MESSAGE,
        (error as Error)?.message,
      );
    }
  }

  public async disconnect(): Promise<void> {
    if (this.clientState === KafkaClientState.DISCONNECTED) {
      return;
    }

    try {
      await this.producer.disconnect();
    } catch (error) {
      throw new KafkaClientError(
        KafkaClientErrorCode.KAFKA_CLIENT_ERROR,
        (error as Error)?.message,
      );
    } finally {
      super.disconnect();
    }
  }
}
