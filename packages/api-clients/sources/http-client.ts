import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class HttpClient {
  protected axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
    });
  }

  protected sendRequest<T>(method: string, url: string, data?: unknown): Promise<AxiosResponse<T>> {
    // @TODO: In the future, retrive JWT first using bot's creds.
    return this.axios.request({
      method,
      url,
      data,
    });
  }
}
