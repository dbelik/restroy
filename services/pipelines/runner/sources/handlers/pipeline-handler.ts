import { PipelineHistoryClient, PluginsClient } from '@restroy/api-clients';
import {
  PipelineHistoryModel, PipelineHistoryNodeModel,
  PipelineMessageNodeModel,
} from '@restroy/core';
import { Pipeline } from '@restroy/pipeline-utils';

import config from '../config';
import PluginRunner from '../runners/plugin-runner';

export default class PipelineHandler {
  private pipelineHistoryClient: PipelineHistoryClient;

  private pluginsClient: PluginsClient;

  private pluginRunner: PluginRunner;

  constructor() {
    this.pluginsClient = new PluginsClient(config.api.general.url);
    this.pipelineHistoryClient = new PipelineHistoryClient(config.api.general.url);
    this.pluginRunner = new PluginRunner();
  }

  async handleOneNode(node: PipelineMessageNodeModel): Promise<PipelineHistoryModel> {
    const pipeline = await this.pipelineHistoryClient.getPipelineHistoryRecord(
      node.pipeline_id,
      node.history_record_id,
    );
    const structure = Pipeline.tryCreateFromJSON(pipeline.original_structure);
    const nodeData = structure.node(node.node_id) as PipelineHistoryNodeModel;
    const plugin = await this.pluginsClient.getPlugin(nodeData.plugin_id);
    const pluginResult = await this.pluginRunner.run(plugin, {});
    const data = {
      structure: {
        nodes: [{
          v: node.node_id,
          value: {
            status: pluginResult.result.success ? 'success' : 'failed',
            finished_at: pluginResult.endedAt,
            started_at: pluginResult.startedAt,
          },
        }],
      },
    };
    return this.pipelineHistoryClient.updatePipelineHistoryRecord(
      node.pipeline_id,
      node.history_record_id,
      data,
    );
  }
}
