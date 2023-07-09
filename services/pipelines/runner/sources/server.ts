import { KafkaClientOptions, KafkaConsumer } from '@restroy/kafka-client';

import config from './config';

class PipelineRunnerServer {
  protected consumer: KafkaConsumer;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.consumer = new KafkaConsumer(kafkaConfig);
  }

  async init() {
    await this.consumer.init();
    await this.consumer.subscribe(config.pipelines.topic, {
      message: async (payload) => console.log(payload),
    });
  }
}

async function startup() {
  const server = new PipelineRunnerServer(config.kafka);
  await server.init();
}

startup().catch((error) => {
  throw error;
});
