import NodeEnvironmentConfig from '../node-environment-config';

describe('NodeEnvironmentConfig class', () => {
  describe('get method', () => {
    it('should return the environment variable value', () => {
      const environment = { SOME_KEY: 'someValue' };
      const config = new NodeEnvironmentConfig(environment);
      const result = config.get('SOME_KEY');

      expect(result).toBe('someValue');
    });

    it('should return empty string value when trying to access variable that is not defined', () => {
      const environment = { SOME_KEY: 'someValue' };
      const config = new NodeEnvironmentConfig(environment);
      const result = config.get('SOME_KEY2');

      expect(result).toBe('');
    });

    it('should return default value when trying to access variable that is not defined, but with the supplied default value', () => {
      const environment = { SOME_KEY: 'someValue' };
      const config = new NodeEnvironmentConfig(environment);
      const result = config.get('SOME_KEY2', 'defaultValue');

      expect(result).toBe('defaultValue');
    });
  });
});
