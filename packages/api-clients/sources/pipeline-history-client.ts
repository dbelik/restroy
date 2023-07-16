import { PipelineHistoryModel, PipelineUpdateHistoryRecordInputDto } from '@restroy/core';

import HttpClient from './http-client';

export default class PipelineHistoryClient extends HttpClient {
  public constructor(baseURL: string) {
    super(baseURL);
  }

  // @TODO: Use cache here
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

  public async updatePipelineHistoryRecord(
    pipelineId: string,
    historyId: string,
    data: PipelineUpdateHistoryRecordInputDto,
  ): Promise<PipelineHistoryModel> {
    const result = await this.sendRequest<PipelineHistoryModel>('PATCH', `/pipelines/${pipelineId}/history/${historyId}`, data);
    return result.data;
  }
}
