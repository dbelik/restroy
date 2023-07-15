import { Pipeline } from '@restroy/pipeline-utils';

import PipelineHistoryHelper from '../pipeline-history.helper';

describe('PipelineHistoryHelper class', () => {
  let pipelineHistoryHelper: PipelineHistoryHelper;

  beforeEach(() => {
    pipelineHistoryHelper = new PipelineHistoryHelper();
  });

  describe('injectNodesDataIntoStructure method', () => {
    it('should inject into a pipeline labels for nodes', () => {
      const nodes = [
        {
          id: '1',
          settings: {},
          pipeline_id: '12',
          plugin_id: '13',
        },
      ];
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          { v: '1' },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
        ],
      });
      const expectedResult = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'pending',
              plugin_id: '13',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
        ],
      });

      const result = pipelineHistoryHelper.injectNodesDataIntoStructure(pipeline, nodes);

      expect(
        Pipeline.pipelineToObject(result),
      ).toEqual(
        Pipeline.pipelineToObject(expectedResult),
      );
    });
  });
});
