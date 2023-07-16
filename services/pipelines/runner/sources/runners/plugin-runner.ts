import { PluginModel } from '@restroy/core';

import RunnerError from '../errors/runner-error';
import { IScriptStatistics } from './general';
import JavaScriptRunner from './javascript-runner';

export default class PluginRunner {
  private readonly javascriptRunner: JavaScriptRunner;

  constructor() {
    this.javascriptRunner = new JavaScriptRunner();
  }

  public async run(
    plugin: PluginModel,
    data: object,
  ): Promise<IScriptStatistics> {
    switch (plugin.settings.language) {
      case 'Javascript': {
        return this.javascriptRunner.run(plugin.code, data);
      }
      default: {
        throw new RunnerError('Unsupported language');
      }
    }
  }
}
