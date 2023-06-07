import { ConsumerConfig, Kafka, SASLOptions } from 'kafkajs';

/**
 * Kafka client options.
 */
export interface KafkaClientOptions extends ConsumerConfig {
  connection: {
    clientId: string;
    brokers: string[];
    ssl: boolean;
    sasl: SASLOptions;
  };
}

export enum KafkaClientState {
  INITIAL = 'INITIAL',
  SUBSCRIBING = 'SUBSCRIBING',
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBING = 'UNSUBSCRIBING',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  DISCONNECTED = 'DISCONNECTED',
}

/**
 * Kafka client that defines state and general methods for interacting with Kafka.
 */
export default abstract class KafkaClient {
  protected options: KafkaClientOptions;

  protected kafka: Kafka;

  protected clientState: KafkaClientState = KafkaClientState.INITIAL;

  protected constructor(options: KafkaClientOptions) {
    this.options = options;
    switch (this.options.connection.sasl.mechanism) {
      case 'plain': {
        const { username, password } = this.options.connection.sasl;
        const shouldRemoveSasl = username || password;

        const connection = {
          ...this.options.connection,
          sasl: shouldRemoveSasl ? this.options.connection.sasl : undefined,
        };

        this.kafka = new Kafka(connection);
        break;
      }
      default: {
        this.kafka = new Kafka(this.options.connection);
        break;
      }
    }
  }

  public abstract init(): Promise<void>;

  public disconnect() {
    this.clientState = KafkaClientState.DISCONNECTED;
  }
}
