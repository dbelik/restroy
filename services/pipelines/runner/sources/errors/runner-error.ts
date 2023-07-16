export default class RunnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RunnerError';
  }
}
