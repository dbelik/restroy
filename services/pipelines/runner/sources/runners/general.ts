export interface IRunnerResult {
  success: boolean;
  data?: unknown;
}

export interface IRunnerData {
  settings: {
    [key: string]: unknown;
  };
}

export interface IRunner {
  run(script: string, data: IRunnerData): Promise<IRunnerResult>;
}
