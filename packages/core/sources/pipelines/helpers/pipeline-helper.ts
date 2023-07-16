import { Pipeline } from '@restroy/pipeline-utils';

import { PipelineMessageNodeModel } from '../../pipeline-history';

export type MappedPipeline = {
  id: string;
  children: string[];
};

export default class PipelineHelper {
  public mapPipelineModel(id: string, structure: object, firstNodeName = 'START'): MappedPipeline {
    const pipeline = Pipeline.tryCreateFromString(JSON.stringify(structure));
    const children = Pipeline.getEdgesNames(pipeline, firstNodeName);
    return {
      id,
      children,
    };
  }

  public mapChildrenToMessages(
    historyRecordId: string,
    pipelineId: string,
    children: string[],
  ): PipelineMessageNodeModel[] {
    return children.map((childId) => ({
      history_record_id: historyRecordId,
      pipeline_id: pipelineId,
      node_id: childId,
    }));
  }

  public mapStructureToMessage(pipelineId: string, historyRecordId: string, structure: object, firstNodeName = 'START') {
    const originalStructure = this.mapPipelineModel(
      pipelineId,
      structure,
      firstNodeName,
    );

    const messages = this.mapChildrenToMessages(
      historyRecordId,
      originalStructure.id,
      originalStructure.children,
    );

    return messages;
  }
}
