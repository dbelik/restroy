import { VM } from 'vm2';

import { IRunner, IRunnerData, IRunnerResult } from './general';

export default class JavaScriptRunner implements IRunner {
  private static preprocessScript(script: string): string {
    return `(${script})();`;
  }

  public async run(code: string, data: IRunnerData): Promise<IRunnerResult> {
    const vm = new VM({
      timeout: 2 * 60 * 1000,
      sandbox: {
        data,
      },
    });
    const script = JavaScriptRunner.preprocessScript(code);
    const result = (await vm.run(script)) as IRunnerResult;
    return result;
  }
}
