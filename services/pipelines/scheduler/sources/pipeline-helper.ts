import { Pipeline, PipelineNode } from '@restroy/pipeline-utils';

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
  ): PipelineNode[] {
    return children.map((childId) => ({
      history_record_id: historyRecordId,
      pipeline_id: pipelineId,
      node_id: childId,
    }));
  }
}
