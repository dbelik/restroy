import { NodeEnvConfig } from '@restroy/config-utils';
import { KafkaClientOptions } from '@restroy/kafka-client';

const config = new NodeEnvConfig(process.env);

export default {
  kafka: {
    connection: {
      clientId: config.get('PIPELINE_RUNNER__KAFKA_CONNECTION__CLIENTID', '1'),
      brokers: JSON.parse(
        config.get('PIPELINE_RUNNER__KAFKA_CONNECTION__BROKERS', '["localhost:9093"]'),
      ) as string[],
      ssl: false,
      sasl: {
        password: config.get('KAFKA_CONNECTION_PASSWORD'),
        username: config.get('KAFKA_CONNECTION_USERNAME'),
        mechanism: config.get('KAFKA_CONNECTION_MECHANISM', 'plain'),
      },
    },
    groupId: config.get('PIPELINE_RUNNER__KAFKA_GROUPID', 'pipeline-runner'),
  } as KafkaClientOptions,

  pipelines: {
    topic: config.get('PIPELINE_RUNNER__PIPELINES__TOPIC', 'pipelines'),
  },

  api: {
    general: {
      url: config.get('PIPELINE_SCHEDULER__API__GENERAL__URL', 'http://localhost:3000'),
    },
  },
};
