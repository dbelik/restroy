/**
 * Config interface that defines general methods for
 * all config implementations.
 */
export default abstract class Config {
  public abstract get(key: string): unknown;
}
