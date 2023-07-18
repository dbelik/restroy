import { PipelineHelper, PipelineMessageNodeModel } from '@restroy/core';
import { KafkaClientOptions, KafkaConsumer, KafkaProducer } from '@restroy/kafka-client';

import config from './config';
import PipelineHandler from './handlers/pipeline-handler';

class PipelineRunnerServer {
  protected consumer: KafkaConsumer;

  protected producer: KafkaProducer;

  protected pipelineHandler: PipelineHandler;

  protected pipelineHelper: PipelineHelper;

  constructor(kafkaConsumerConfig: KafkaClientOptions, kafkaProducerConfig: KafkaClientOptions) {
    this.consumer = new KafkaConsumer(kafkaConsumerConfig);
    this.producer = new KafkaProducer(kafkaProducerConfig);
    this.pipelineHandler = new PipelineHandler();
    this.pipelineHelper = new PipelineHelper();
  }

  async init() {
    await this.consumer.init();
    await this.producer.init();

    await this.consumer.subscribe(config.pipelines.topic, {
      message: async (payload) => {
        const pipelineString = payload.message.value.toString();
        const node = JSON.parse(pipelineString) as PipelineMessageNodeModel;
        const history = await this.pipelineHandler.handleOneNode(node);
        const messages = this.pipelineHelper.mapStructureToMessage(
          node.pipeline_id,
          node.history_record_id,
          history.original_structure,
          node.node_id,
        );

        console.log(`Sending ${messages.length} messages to Kafka`);
        console.log(`Messages: ${JSON.stringify(messages)}`);

        await this.producer.send(
          config.pipelines.topic,
          messages.map((message) => ({ value: JSON.stringify(message) })),
        );
      },
    });
  }
}

async function startup() {
  const server = new PipelineRunnerServer(config.kafka.consumer, config.kafka.producer);
  await server.init();
}

startup().catch((error) => {
  throw error;
});
