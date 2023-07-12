import { CompressionTypes, Producer } from 'kafkajs';

import KafkaClientError, { KafkaClientErrorCode } from '../client-error';
import { KafkaClientOptions, KafkaClientState } from '../kafka-client';
import KafkaProducer from '../kafka-producer';

describe('KafkaProducer class', () => {
  const options: KafkaClientOptions = {
    connection: {
      clientId: 'test',
      brokers: ['localhost:9092'],
      ssl: false,
      sasl: {
        mechanism: 'plain',
        username: 'test',
        password: 'test',
      },
    },
    groupId: 'test',
  };

  let kafkaProducer: KafkaProducer;
  let mockKafkajsProducer: jasmine.SpyObj<Producer>;

  beforeEach(() => {
    mockKafkajsProducer = jasmine.createSpyObj('Producer', [
      'connect',
      'disconnect',
      'send',
    ]) as jasmine.SpyObj<Producer>;
    kafkaProducer = new KafkaProducer(options);
    kafkaProducer['producer'] = mockKafkajsProducer;
  });

  describe('constructor method', () => {
    it('should create a new instance of KafkaProducer using plain mechanism', async () => {
      const result = new KafkaProducer(options);

      expect(result).toBeInstanceOf(KafkaProducer);
    });
  });

  describe('init method', () => {
    it('should initialize the KafkaProducer', async () => {
      await kafkaProducer.init();

      expect(mockKafkajsProducer.connect).toHaveBeenCalledWith();
    });
  });

  describe('send method', () => {
    it('should send a message to Kafka', async () => {
      await kafkaProducer.send('test', { key: 'test', value: 'test' });

      expect(mockKafkajsProducer.send).toHaveBeenCalledWith({
        topic: 'test',
        messages: [{ key: 'test', value: 'test' }],
        compression: CompressionTypes.Snappy,
      });
    });

    it('should throw an error when sending a message to Kafka fails', async () => {
      mockKafkajsProducer.send.and.throwError(new Error('Failed to send message to Kafka.'));
      await expectAsync(kafkaProducer.send('test', { key: 'test', value: 'test' })).toBeRejectedWith(
        new KafkaClientError(
          KafkaClientErrorCode.KAFKA_CLIENT_ERROR,
          'Failed to send message to Kafka.',
        ),
      );

      expect(mockKafkajsProducer.send).toHaveBeenCalledWith({
        topic: 'test',
        messages: [{ key: 'test', value: 'test' }],
        compression: CompressionTypes.Snappy,
      });
    });
  });

  describe('disconnect method', () => {
    it('should disconnect from Kafka', async () => {
      await kafkaProducer.disconnect();

      expect(mockKafkajsProducer.disconnect).toHaveBeenCalledWith();
    });

    it('should not disconnect from Kafka when client state is DISCONNECTED', async () => {
      kafkaProducer['clientState'] = KafkaClientState.DISCONNECTED;
      await kafkaProducer.disconnect();

      expect(mockKafkajsProducer.disconnect).not.toHaveBeenCalledWith();
    });

    it('should throw an error when disconnecting from Kafka fails', async () => {
      mockKafkajsProducer.disconnect.and.throwError(new Error('Failed to disconnect from Kafka.'));
      await expectAsync(kafkaProducer.disconnect()).toBeRejectedWith(
        new KafkaClientError(
          KafkaClientErrorCode.KAFKA_CLIENT_ERROR,
          'Failed to disconnect from Kafka.',
        ),
      );

      expect(mockKafkajsProducer.disconnect).toHaveBeenCalledWith();
    });
  });
});
