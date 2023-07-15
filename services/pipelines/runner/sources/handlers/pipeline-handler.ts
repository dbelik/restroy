import { PipelineHistoryClient } from '@restroy/api-clients';
import { Pipeline, PipelineNode } from '@restroy/pipeline-utils';

import config from '../config';

export default class PipelineHandler {
  private pipelineHistoryClient: PipelineHistoryClient;

  constructor() {
    this.pipelineHistoryClient = new PipelineHistoryClient(config.api.general.url);
  }

  async handleOneNode(node: PipelineNode) {
    const pipeline = await this.pipelineHistoryClient.getPipelineHistoryRecord(
      node.node_id,
      node.history_record_id,
    );
    const structure = Pipeline.tryCreateFromJSON(pipeline.original_settings);
    console.log(`Pipeline: ${JSON.stringify(Pipeline.pipelineToString(structure))}`);
  }
}
