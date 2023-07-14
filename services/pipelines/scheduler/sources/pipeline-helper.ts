import { PipelineModel } from '@restroy/core';
import { Pipeline, PipelineNode } from '@restroy/pipeline-utils';

export type MappedPipeline = {
  id: string;
  children: string[];
};

export default class PipelineHelper {
  public mapPipelineModels(pipelines: PipelineModel[], firstNodeName = 'START'): MappedPipeline[] {
    const pipelineData = pipelines.map(
      ({ id, structure }) => {
        const pipeline = Pipeline.tryCreateFromString(JSON.stringify(structure));
        const children = Pipeline.getEdgesNames(pipeline, firstNodeName);
        return {
          id,
          children,
        };
      },
    ).filter(Boolean);
    return pipelineData;
  }

  public mapChildrenToMessages(pipelineId: string, children: string[]): PipelineNode[] {
    return children.map((childId) => ({
      pipeline_id: pipelineId,
      node_id: childId,
    }));
  }
}
