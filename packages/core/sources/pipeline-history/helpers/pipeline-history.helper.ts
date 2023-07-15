import { Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { PipelineNodeModel } from '../../pipeline-nodes';
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
}
