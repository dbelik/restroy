import { KafkaClientOptions, KafkaConsumer } from '@restroy/kafka-client';
import { PipelineNode } from '@restroy/pipeline-utils';

import config from './config';
import PipelineHandler from './handlers/pipeline-handler';

class PipelineRunnerServer {
  protected consumer: KafkaConsumer;

  protected pipelineHandler: PipelineHandler;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.consumer = new KafkaConsumer(kafkaConfig);
    this.pipelineHandler = new PipelineHandler();
  }

  async init() {
    await this.consumer.init();
    await this.consumer.subscribe(config.pipelines.topic, {
      message: async (payload) => {
        const pipelineString = payload.message.value.toString();
        const node = JSON.parse(pipelineString) as PipelineNode;
        await this.pipelineHandler.handleOneNode(node);
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
