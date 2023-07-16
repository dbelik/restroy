import { Pipeline } from '@restroy/pipeline-utils';

export default class PipelineHelper {
  getNextNodes(structure: object, nodeId: string) {
    const pipeline = Pipeline.tryCreateFromJSON(structure);
    const edges = pipeline.outEdges(nodeId);
    if (Array.isArray(edges)) {
      return edges.map((edge) => edge.w);
    }
    return [];
  }
}
