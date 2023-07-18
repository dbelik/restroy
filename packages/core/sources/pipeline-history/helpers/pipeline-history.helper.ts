import { Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { PipelineNodeDecryptedModel, PipelineNodeHelper } from '../../pipeline-nodes';
import { PipelineStatusEnum, PipelineStructureNodesOnlyInputDto } from '../../pipelines/dtos';
import { PipelineHistoryNodeDecryptedModel, PipelineHistoryNodeEncryptedModelModel } from '../models';

@Injectable()
export default class PipelineHistoryHelper {
  constructor(
    private readonly pipelineNodeHelper: PipelineNodeHelper,
  ) {}

  decryptHistoryRecordStructure(
    structure: Pipeline,
  ): Pipeline {
    structure
      .nodes()
      .filter((nodeId) => nodeId !== 'START')
      .forEach((nodeId) => {
        const node = structure.node(nodeId) as PipelineHistoryNodeEncryptedModelModel;
        if (node.settings) {
          const newNode = {
            ...node,
            settings: this.pipelineNodeHelper.decryptNodeSettings(node.settings),
          };
          structure.setNode(nodeId, newNode);
        }
      });
    return structure;
  }

  encryptHistoryRecordStructure(
    structure: Pipeline,
  ): Pipeline {
    structure
      .nodes()
      .filter((nodeId) => nodeId !== 'START')
      .forEach((nodeId) => {
        const node = structure.node(nodeId) as PipelineHistoryNodeDecryptedModel;
        if (node.settings) {
          const newNode = {
            ...node,
            settings: this.pipelineNodeHelper.encryptNodeSettings(node.settings),
          };
          structure.setNode(nodeId, newNode);
        }
      });
    return structure;
  }

  injectNodesDataIntoStructure(structure: Pipeline, nodes: PipelineNodeDecryptedModel[]) {
    nodes.forEach((node) => {
      const nodeData: PipelineHistoryNodeDecryptedModel = {
        status: 'pending',
        plugin_id: node.plugin_id,
        settings: node.settings,
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
      const historyNode = historyStructure.node(node.v) as PipelineHistoryNodeEncryptedModelModel;
      const newNode: PipelineHistoryNodeEncryptedModelModel = {
        plugin_id: historyNode.plugin_id,
        status: node.value.status ?? historyNode.status,
        finished_at: node.value.finished_at ?? historyNode.finished_at,
        started_at: node.value.started_at ?? historyNode.started_at,
      };
      if (newNode.status !== PipelineStatusEnum.SUCCESS
        && newNode.status !== PipelineStatusEnum.FAILED) {
        newNode.settings = historyNode.settings;
      }
      historyStructure.setNode(node.v, newNode);
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
        const node = structure.node(nodeId) as PipelineHistoryNodeEncryptedModelModel;
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
