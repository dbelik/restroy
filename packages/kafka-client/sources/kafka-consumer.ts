import { Consumer, EachMessageHandler, EachMessagePayload } from 'kafkajs';

import KafkaClientError, { KafkaClientErrorCode } from './client-error';
import KafkaClient, { KafkaClientOptions, KafkaClientState } from './kafka-client';

export type KafkaMessageHandler = EachMessageHandler;

export interface KafkaSubscribeHandlers {
  message: KafkaMessageHandler;
}

/**
 * Kafka consumer that defines state and methods for consuming messages from Kafka.
 */
export default class KafkaConsumer extends KafkaClient {
  protected consumer: Consumer;

  private messageHandlers: Map<string, KafkaSubscribeHandlers> = new Map();

  public constructor(options: KafkaClientOptions) {
    super(options);
    this.consumer = this.kafka.consumer(this.options);
  }

  public async init(): Promise<void> {
    await this.consumer.connect();
  }

  public async subscribe(newTopic: string, handlers: KafkaSubscribeHandlers): Promise<void> {
    if (this.clientState === KafkaClientState.SUBSCRIBING) {
      throw new KafkaClientError(
        KafkaClientErrorCode.KAFKA_CLIENT_ALREADY_STARTING,
        'Failed to subscribe to Kafka topic.',
      );
    }

    try {
      this.clientState = KafkaClientState.SUBSCRIBING;
      await this.consumer.stop();

      this.messageHandlers.set(newTopic, handlers);
      const allTopics = [...this.messageHandlers.keys()];
      await this.consumer.subscribe({ topics: allTopics });

      await this.consumer.run({
        eachMessage: (payload) => this.onMessage(payload),
      });
      this.clientState = KafkaClientState.SUBSCRIBED;
    } catch {
      await this.disconnect();
    }
  }

  private async onMessage(payload: EachMessagePayload) {
    const handlers = this.messageHandlers.get(payload.topic);
    if (!handlers) {
      return;
    }
    await handlers.message(payload);
  }

  public async disconnect(): Promise<void> {
    if (this.clientState === KafkaClientState.DISCONNECTED) {
      return;
    }

    try {
      await this.consumer.disconnect();
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
