import { Pipeline } from '@restroy/pipeline-utils';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'PipelineStructure', async: false })
export default class PipelineStructureConstraint implements ValidatorConstraintInterface {
  validate(pipeline: object) {
    const structure = Pipeline.tryCreateFromJSON(pipeline);
    if (!structure) {
      return false;
    }

    const children = structure.nodeEdges('START');
    return structure.hasNode('START')
      && children
      && children?.length > 0
      && structure.isDirected()
      && Pipeline.checkAcyclic(structure)
      && !structure.isMultigraph();
  }

  defaultMessage() {
    return 'Pipeline must have correct structure!';
  }
}
