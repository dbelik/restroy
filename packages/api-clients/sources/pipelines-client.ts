import { PipelineModel, SearchResult } from '@restroy/core';

import HttpClient from './http-client';

export default class PipelinesClient extends HttpClient {
  public constructor(baseURL: string) {
    super(baseURL);
  }

  public async getPipeline(id: string): Promise<PipelineModel> {
    const result = await this.sendRequest<PipelineModel>('GET', `/pipelines/${id}`);
    return result.data;
  }

  public async getDuePipelines(date: Date): Promise<SearchResult<PipelineModel>> {
    const result = await this.sendRequest<SearchResult<PipelineModel>>('PATCH', '/pipelines/due', { next_date: date });
    return result.data;
  }
}
