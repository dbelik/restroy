import { PipelineClient } from '@restroy/api-clients';
import { Pipeline, PipelineNode } from '@restroy/pipeline-utils';

import config from '../config';

export default class PipelineHandler {
  private pipelineClient: PipelineClient;

  constructor() {
    this.pipelineClient = new PipelineClient(config.api.general.url);
  }

  async handleOneNode(node: PipelineNode) {
    const pipeline = await this.pipelineClient.getPipeline(node.pipeline_id);
    const structure = Pipeline.tryCreateFromJSON(pipeline.structure);
    console.log(`Pipeline: ${JSON.stringify(pipeline.structure)}`);
  }
}
