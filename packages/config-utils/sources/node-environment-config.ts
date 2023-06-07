import Config from './config';

/**
 * Config implementation that uses the NodeJS process.env.
 */
export default class NodeEnvironmentConfig extends Config {
  private readonly env: Map<string, string>;

  constructor(environment: NodeJS.ProcessEnv) {
    super();
    this.env = new Map(Object.entries(environment).map(([key, value]) => [key, value ?? '']));
  }

  public get(key: string, defaultValue = ''): string {
    return this.env.get(key) ?? defaultValue;
  }
}
