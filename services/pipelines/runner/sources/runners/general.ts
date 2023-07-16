export interface IRunnerResult {
  success: boolean;
  data?: unknown;
}

export interface IScriptStatistics {
  startedAt: string;
  endedAt: string;
  result: IRunnerResult;
}

export interface IRunner {
  run(script: string, data: object): Promise<IScriptStatistics>;
}
