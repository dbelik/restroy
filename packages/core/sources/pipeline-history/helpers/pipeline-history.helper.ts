import { Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { PipelineNodeModel } from '../../pipeline-nodes';
import { PipelineStatusEnum, PipelineStructureNodesOnlyInputDto } from '../../pipelines/dtos';
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

  chooseHistoryRecordStatusFromStructure(
    structure: Pipeline,
  ): PipelineStatusEnum {
    let allSucceeded = true;
    let someFailed = false;
    let someRunning = false;
    let somePaused = false;

    structure
      .nodes()
      .filter((nodeId) => nodeId !== 'START')
      .forEach((nodeId) => {
        const node = structure.node(nodeId) as PipelineHistoryNodeModel;
        allSucceeded = allSucceeded && node.status === PipelineStatusEnum.SUCCESS;
        someFailed = someFailed || node.status === PipelineStatusEnum.FAILED;
        someRunning = someRunning || node.status === PipelineStatusEnum.RUNNING;
        somePaused = somePaused || node.status === PipelineStatusEnum.PAUSED;
      });

    if (allSucceeded) return PipelineStatusEnum.SUCCESS;
    if (someFailed) return PipelineStatusEnum.FAILED;
    if (someRunning) return PipelineStatusEnum.RUNNING;
    if (somePaused) return PipelineStatusEnum.PAUSED;
    return PipelineStatusEnum.PENDING;
  }
}
