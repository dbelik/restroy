import { VM } from 'vm2';

import { IRunner, IRunnerResult, IScriptStatistics } from './general';

export default class JavaScriptRunner implements IRunner {
  private static preprocessScript(script: string): string {
    return `(async () => {${script}})();`;
  }

  public async run(code: string, data: object): Promise<IScriptStatistics> {
    const vm = new VM({
      timeout: 2 * 60 * 1000,
      sandbox: {
        data,
      },
    });
    const startedAt = new Date().toISOString();
    const script = JavaScriptRunner.preprocessScript(code);
    const result = (await vm.run(script)) as IRunnerResult;
    const statistics: IScriptStatistics = {
      startedAt,
      endedAt: new Date().toISOString(),
      result: {
        success: result?.success ?? true,
        data: result?.data,
      },
    };
    return statistics;
  }
}
