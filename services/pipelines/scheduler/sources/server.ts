import { PipelineHistoryClient, PipelinesClient } from '@restroy/api-clients';
import { PipelineHelper } from '@restroy/core';
import { KafkaClientOptions, KafkaProducer } from '@restroy/kafka-client';
import { scheduleJob } from 'node-schedule';

import config from './config';

class PipelineSchedulerServer {
  private producer: KafkaProducer;

  private pipelineClient: PipelinesClient;

  private pipelineHelper: PipelineHelper;

  private pipelineHistoryClient: PipelineHistoryClient;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.pipelineClient = new PipelinesClient(config.api.general.url);
    this.pipelineHistoryClient = new PipelineHistoryClient(config.api.general.url);
    this.producer = new KafkaProducer(kafkaConfig);
    this.pipelineHelper = new PipelineHelper();
  }

  async init() {
    await this.producer.init();
  }

  loop() {
    return scheduleJob(config.scheduler.frequency, async (date) => {
      date.setSeconds(0, 0);
      date.setMilliseconds(0);

      let morePipelines = false;
      do {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.pipelineClient.getDuePipelines(date);
        const pipelines = result.data;

        morePipelines = result.meta.total > result.meta.limit;
        console.log(`Pipelines: ${pipelines.length}; Date: ${date.toISOString()}`);

        if (result.meta.total === 0) {
          break;
        }

        // eslint-disable-next-line no-await-in-loop
        await Promise.all([
          pipelines.map(async ({ id }) => {
            const historyRecord = await this.pipelineHistoryClient.createPipelineHistoryRecord(
              id,
              date.toISOString(),
            );

            const messages = this.pipelineHelper.mapStructureToMessage(
              id,
              historyRecord.id,
              historyRecord.original_structure,
            );

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
