import { KafkaClientOptions, KafkaConsumer } from '@restroy/kafka-client';
import { PipelineNode } from '@restroy/pipeline-utils';

import config from './config';

class PipelineRunnerServer {
  protected consumer: KafkaConsumer;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.consumer = new KafkaConsumer(kafkaConfig);
  }

  async init() {
    await this.consumer.init();
    await this.consumer.subscribe(config.pipelines.topic, {
      message: async (payload) => {
        const pipelineString = payload.message.value.toString();
        const pipeline = JSON.parse(pipelineString) as PipelineNode;
        console.log(`Pipeline ID: ${pipeline.pipeline_id}, Node ID: ${pipeline.node_id}`);
      },
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
