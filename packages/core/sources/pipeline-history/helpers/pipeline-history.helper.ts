import { Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { PipelineNodeModel } from '../../pipeline-nodes';
import { PipelineStructureNodesOnlyInputDto } from '../../pipelines/dtos';
import { PipelineHistoryNodeModel } from '../models';

@Injectable()
export default class PipelineHistoryHelper {
  injectNodesDataIntoStructure(structure: Pipeline, nodes: PipelineNodeModel[]) {
    nodes.forEach((node) => {
      const nodeData: PipelineHistoryNodeModel = {
        status: 'pending',
        plugin_id: node.plugin_id,
      };
      structure.setNode(node.id, nodeData);
    });
    return structure;
  }

  mergeNodesIntoHistoryRecordStructure(
    historyStructure: Pipeline,
    newStructure: PipelineStructureNodesOnlyInputDto,
  ): Pipeline {
    newStructure.nodes.forEach((node) => {
      const historyNode = historyStructure.node(node.v) as PipelineHistoryNodeModel;
      historyStructure.setNode(node.v, {
        ...historyNode,
        status: node.value.status ?? historyNode.status,
        finished_at: node.value.finished_at ?? historyNode.finished_at,
        started_at: node.value.started_at ?? historyNode.started_at,
      });
    });
    return historyStructure;
  }
}
