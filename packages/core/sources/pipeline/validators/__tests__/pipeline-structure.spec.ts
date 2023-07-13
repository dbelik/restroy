import PipelineStructureConstraint from '../pipeline-structure';

describe('PipelineStructureConstraint class', () => {
  let pipeline: PipelineStructureConstraint;

  beforeEach(() => {
    pipeline = new PipelineStructureConstraint();
  });

  describe('validate method', () => {
    it('should return false when pipeline is not a JSON object', () => {
      const pipelineString = 'hello';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return false when pipeline is a JSON object but does not have the right fields', () => {
      const pipelineString = '{ "some": "field" }';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return false when pipeline is a JSON object but passes special options field', () => {
      const pipelineString = '{"options":{"directed":false}}';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return false when pipeline is a JSON object but does not have START node', () => {
      const pipelineString = '{"nodes":[{"v":"11"},{"v":"10"}],"edges":[{"v":"10","w":"11"}]}';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return false when pipeline is a JSON object but only has START node', () => {
      const pipelineString = '{"nodes":[{"v":"START"}]}';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return false when pipeline is a JSON object but is acyclic', () => {
      const pipelineString = '{"nodes":[{"v":"START"},{"v":"10"}],"edges":[{"v":"10","w":"START"},{"v":"START","w":"10"}]}';

      expect(pipeline.validate(pipelineString)).toBeFalse();
    });

    it('should return true when passing correct graph', () => {
      const pipelineString = '{"nodes":[{"v":"START"},{"v":"10"}],"edges":[{"v":"START","w":"10"}]}';

      expect(pipeline.validate(pipelineString)).toBeTrue();
    });

    it('should return true when passing graph with 3 nodes and 2 edges', () => {
      const pipelineString = '{"nodes":[{"v":"START"},{"v":"10"},{"v":"11"}],"edges":[{"v":"START","w":"10"},{"v":"10","w":"11"}]}';

      expect(pipeline.validate(pipelineString)).toBeTrue();
    });

    it('should return true when passing graph with 3 nodes and 2 edges from START', () => {
      const pipelineString = '{"nodes":[{"v":"START"},{"v":"10"},{"v":"11"}],"edges":[{"v":"START","w":"10"},{"v":"START","w":"11"}]}';

      expect(pipeline.validate(pipelineString)).toBeTrue();
    });
  });
});
