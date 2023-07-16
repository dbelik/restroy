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

  describe('chooseHistoryRecordStatusFromStructure method', () => {
    it('should return success if all nodes are success', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'success',
            },
          },
          {
            v: '2',
            value: {
              status: 'success',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('success');
    });

    it('should return failed if some nodes are failed', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'success',
            },
          },
          {
            v: '2',
            value: {
              status: 'failed',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('failed');
    });

    it('should return paused if some nodes are paused', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'success',
            },
          },
          {
            v: '2',
            value: {
              status: 'paused',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('paused');
    });

    it('should return running if some nodes are running', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'success',
            },
          },
          {
            v: '2',
            value: {
              status: 'running',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('running');
    });

    it('should return pending when some nodes are succeeded, but other have pending state', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'success',
            },
          },
          {
            v: '2',
            value: {
              status: 'pending',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('pending');
    });

    it('should return pending if all nodes are pending', () => {
      const pipeline = Pipeline.tryCreateFromJSON({
        nodes: [
          { v: 'START' },
          {
            v: '1',
            value: {
              status: 'pending',
            },
          },
          {
            v: '2',
            value: {
              status: 'pending',
            },
          },
        ],
        edges: [
          {
            v: 'START',
            w: '1',
          },
          {
            v: '1',
            w: '2',
          },
        ],
      });

      const result = pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(pipeline);

      expect(result).toEqual('pending');
    });
  });
});
