import { PipelineHistoryModel } from '@restroy/core';

import HttpClient from './http-client';

export default class PipelineHistoryClient extends HttpClient {
  public constructor(baseURL: string) {
    super(baseURL);
  }

  public async getPipelineHistoryRecord(
    pipelineId: string,
    historyId: string,
  ): Promise<PipelineHistoryModel> {
    const result = await this.sendRequest<PipelineHistoryModel>('GET', `/pipelines/${pipelineId}/history/${historyId}`);
    return result.data;
  }

  public async createPipelineHistoryRecord(
    pipelineId: string,
    date: string,
  ): Promise<PipelineHistoryModel> {
    const result = await this.sendRequest<PipelineHistoryModel>('POST', `/pipelines/${pipelineId}/history`, {
      start_date: date,
    });
    return result.data;
  }
}
