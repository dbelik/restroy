import { PipelineClient } from '@restroy/clients';
import { KafkaClientOptions, KafkaProducer } from '@restroy/kafka-client';
import { scheduleJob } from 'node-schedule';

import config from './config';

class PipelineSchedulerServer {
  private producer: KafkaProducer;

  private pipelineClient: PipelineClient;

  constructor(kafkaConfig: KafkaClientOptions) {
    this.pipelineClient = new PipelineClient(config.api.general.url);
    this.producer = new KafkaProducer(kafkaConfig);
  }

  async init() {
    await this.producer.init();
  }

  loop() {
    return scheduleJob(config.scheduler.frequency, async (date) => {
      let morePipelines = false;
      do {
        // eslint-disable-next-line no-await-in-loop
        const pipelines = await this.pipelineClient.getDuePipelines(date);
        console.log(`Pipelines: ${pipelines.data.length}; Date: ${date.toISOString()}`);
        morePipelines = pipelines.meta.total > pipelines.meta.limit;
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
