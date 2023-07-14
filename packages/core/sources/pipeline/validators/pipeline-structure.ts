import { Pipeline } from '@restroy/pipeline-utils';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'PipelineStructure', async: false })
export default class PipelineStructureConstraint implements ValidatorConstraintInterface {
  private hasStartNode(graph: Pipeline) {
    const children = graph.nodeEdges('START');
    return graph.hasNode('START')
      && children
      && children.length > 0
      && graph.isDirected()
      && Pipeline.checkAcyclic(graph)
      && !graph.isMultigraph();
  }

  private hasAtMostNodes(graph: Pipeline) {
    return graph.nodeCount() <= 32;
  }

  private passesOnlyNecessaryFields(pipeline: string) {
    const options = JSON.parse(pipeline) as object;
    return Object.keys(options).length === 2
      && Object.hasOwn(options, 'nodes')
      && Object.hasOwn(options, 'edges');
  }

  validate(pipeline: string) {
    const graph = Pipeline.tryCreateFromString(pipeline);
    if (!graph) {
      return false;
    }

    return this.hasAtMostNodes(graph)
      && this.passesOnlyNecessaryFields(pipeline)
      && this.hasStartNode(graph);
  }

  defaultMessage() {
    return 'Pipeline must have correct structure!';
  }
}
