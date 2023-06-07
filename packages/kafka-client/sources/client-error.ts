export enum KafkaClientErrorCode {
  KAFKA_CLIENT_ERROR = 'KAFKA_CLIENT_ERROR',
  KAFKA_CLIENT_ALREADY_STARTING = 'KAFKA_CLIENT_ALREADY_STARTING',
  KAFKA_CLIENT_FAILED_TO_DISCONNECT = 'KAFKA_CLIENT_FAILED_TO_DISCONNECT',
}

export default class KafkaClientError extends Error {
  constructor(code = KafkaClientErrorCode.KAFKA_CLIENT_ERROR, message?: string) {
    super(message);
    this.name = code;
  }
}
