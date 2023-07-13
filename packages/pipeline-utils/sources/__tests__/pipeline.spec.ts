import Pipeline from '../pipeline';

describe('Pipeline class', () => {
  describe('createFromString method', () => {
    it('should create a pipeline from a string', () => {
      const encoded = '{"options":{"directed":true,"multigraph":false,"compound":false},"nodes":[{"v":"node1"},{"v":"node2"}],"edges":[{"v":"node1","w":"node2"}]}';
      const result = Pipeline.tryCreateFromString(encoded);

      expect(result.nodes()).toEqual(['node1', 'node2']);
      expect(result.edges()).toEqual([{ v: 'node1', w: 'node2' }]);
    });

    it('should return null when pipeline is invalid', () => {
      const encoded = 'Invalid pipeline';
      const result = Pipeline.tryCreateFromString(encoded);

      expect(result).toBeNull();
    });
  });

  describe('createFromJSON method', () => {
    it('should create a pipeline from a JSON object', () => {
      const encoded = {
        options: { directed: true, multigraph: false, compound: false },
        nodes: [{ v: 'node1' }, { v: 'node2' }],
        edges: [{ v: 'node1', w: 'node2' }],
      };
      const result = Pipeline.tryCreateFromJSON(encoded);

      expect(result.nodes()).toEqual(['node1', 'node2']);
      expect(result.edges()).toEqual([{ v: 'node1', w: 'node2' }]);
    });
  });
});
