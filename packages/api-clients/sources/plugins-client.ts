import { PluginModel } from '@restroy/core';

import HttpClient from './http-client';

export default class PluginsClient extends HttpClient {
  public constructor(baseURL: string) {
    super(baseURL);
  }

  // @TODO: Use cache here
  public async getPlugin(id: string): Promise<PluginModel> {
    const result = await this.sendRequest<PluginModel>('GET', `/plugins/${id}`);
    return result.data;
  }
}
