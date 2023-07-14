import { PipelineClient } from '@restroy/api-cllients';
import { KafkaClientOptions, KafkaProducer } from '@restroy/kafka-client';
import { scheduleJob } from 'node-schedule';

import config from './config';
import PipelineHelper from './pipeline-helper';

class PipelineSchedulerServer {
  private producer: KafkaProducer;

  private pipelineClient: PipelineClient;

  private pipelineHelper: PipelineHelper;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.pipelineClient = new PipelineClient(config.api.general.url);
    this.producer = new KafkaProducer(kafkaConfig);
    this.pipelineHelper = new PipelineHelper();
  }

  async init() {
    await this.producer.init();
  }

  loop() {
    return scheduleJob(config.scheduler.frequency, async (date) => {
      let morePipelines = false;
      do {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.pipelineClient.getDuePipelines(date);
        const pipelines = result.data;
        const pipelineData = this.pipelineHelper.mapPipelineModels(
          pipelines,
          config.pipelines.firstNodeId,
        );

        morePipelines = result.meta.total > result.meta.limit;
        console.log(`Pipelines: ${pipelines.length}; Date: ${date.toISOString()}`);

        // eslint-disable-next-line no-await-in-loop
        await Promise.all([
          pipelineData.map(async ({ id, children }) => {
            const messages = this.pipelineHelper.mapChildrenToMessages(id, children);

            console.log(`Sending ${messages.length} messages to Kafka`);
            console.log(`Messages: ${JSON.stringify(messages)}`);

            // eslint-disable-next-line no-await-in-loop
            await this.producer.send(
              config.pipelines.topic,
              messages.map((message) => ({ value: JSON.stringify(message) })),
            );
          }),
        ]);
      } while (morePipelines);
    });
  }
}

async function startup() {
  const server = new PipelineSchedulerServer(config.kafka);
  await server.init();
  server.loop();
}

startup().catch((error) => {
  throw error;
});
