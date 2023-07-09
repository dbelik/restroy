import Parameter from './parameter';

export default interface IRepositoryClient {
  query: <T>(query: string, parameters: Parameter[]) => Promise<T[]>;
}
