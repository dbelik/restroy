import { Consumer } from 'kafkajs';

import KafkaClientError, { KafkaClientErrorCode } from '../client-error';
import { KafkaClientOptions, KafkaClientState } from '../kafka-client';
import KafkaConsumer from '../kafka-consumer';

describe('KafkaConsumer class', () => {
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

  let kafkaConsumer: KafkaConsumer;
  let mockKafkajsConsumer: jasmine.SpyObj<Consumer>;

  beforeEach(() => {
    mockKafkajsConsumer = jasmine.createSpyObj('Consumer', [
      'connect',
      'disconnect',
      'stop',
      'subscribe',
      'run',
    ]) as jasmine.SpyObj<Consumer>;
    kafkaConsumer = new KafkaConsumer(options);
    kafkaConsumer['consumer'] = mockKafkajsConsumer;
  });

  describe('constructor method', () => {
    it('should create a new instance of KafkaConsumer using plain mechanism', async () => {
      const result = new KafkaConsumer(options);

      expect(result).toBeInstanceOf(KafkaConsumer);
    });
  });

  describe('init method', () => {
    it('should initialize the KafkaConsumer', async () => {
      await kafkaConsumer.init();

      expect(mockKafkajsConsumer.connect).toHaveBeenCalledWith();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to Kafka', async () => {
      await kafkaConsumer.subscribe('test', { message: async () => {} });

      expect(mockKafkajsConsumer.stop).toHaveBeenCalledWith();
      expect(mockKafkajsConsumer.subscribe).toHaveBeenCalledWith({ topics: ['test'] });
      expect(mockKafkajsConsumer.run).toHaveBeenCalledWith({
        eachMessage: jasmine.any(Function),
      });

      expect(kafkaConsumer['clientState']).toBe(KafkaClientState.SUBSCRIBED);
    });

    it('should fail to subscribe to Kafka when client state is SUBSCRIBING', async () => {
      kafkaConsumer['clientState'] = KafkaClientState.SUBSCRIBING;
      await expectAsync(
        kafkaConsumer.subscribe('test', { message: async () => {} }),
      ).toBeRejectedWith(
        new KafkaClientError(
          KafkaClientErrorCode.KAFKA_CLIENT_ALREADY_STARTING,
          'Failed to subscribe to Kafka topic.',
        ),
      );

      expect(mockKafkajsConsumer.stop).not.toHaveBeenCalledWith();
      expect(mockKafkajsConsumer.subscribe).not.toHaveBeenCalledWith({ topics: ['test'] });
      expect(mockKafkajsConsumer.run).not.toHaveBeenCalledWith({
        eachMessage: jasmine.any(Function),
      });
    });

    it('should disconnect from Kafka when we get an error while subscribing to the topic', async () => {
      mockKafkajsConsumer.subscribe.and.throwError(
        new Error('Failed to subscribe to Kafka topic.'),
      );
      await kafkaConsumer.subscribe('test', { message: async () => {} });

      expect(mockKafkajsConsumer.disconnect).toHaveBeenCalledWith();
      expect(kafkaConsumer['clientState']).toBe(KafkaClientState.DISCONNECTED);
    });
  });

  describe('onMessage method', () => {
    const handlers = {
      pause: () => {},
      hearbeat: async () => {},
    };
    const message = {
      topic: 'test2',
      partition: 1,
      message: {
        timestamp: 'now',
        attributes: 1,
        offset: '0',
        size: 1,
        key: Buffer.from('test'),
        value: Buffer.from('value'),
      },
      pause: () => handlers.pause,
      heartbeat: handlers.hearbeat,
    };

    let messageHandler: jasmine.Spy<jasmine.Func>;

    beforeEach(() => {
      messageHandler = jasmine.createSpy('messageHandler');
    });

    it('should call the message handler', async () => {
      kafkaConsumer['messageHandlers'].set('test2', { message: messageHandler });
      await kafkaConsumer['onMessage'](message);

      expect(messageHandler).toHaveBeenCalledWith(message);
    });

    it('should not call the message handler when there is no handler for the topic', async () => {
      kafkaConsumer['messageHandlers'].set('test', { message: messageHandler });
      await kafkaConsumer['onMessage'](message);

      expect(messageHandler).not.toHaveBeenCalled();
    });
  });

  describe('disconnect method', () => {
    it('should disconnect from Kafka', async () => {
      await kafkaConsumer.disconnect();

      expect(mockKafkajsConsumer.disconnect).toHaveBeenCalledWith();
    });

    it('should not disconnect from Kafka when client state is DISCONNECTED', async () => {
      kafkaConsumer['clientState'] = KafkaClientState.DISCONNECTED;
      await kafkaConsumer.disconnect();

      expect(mockKafkajsConsumer.disconnect).not.toHaveBeenCalledWith();
    });

    it('should throw an error when disconnecting from Kafka fails', async () => {
      mockKafkajsConsumer.disconnect.and.throwError(new Error('Failed to disconnect from Kafka.'));
      await expectAsync(kafkaConsumer.disconnect()).toBeRejectedWith(
        new KafkaClientError(
          KafkaClientErrorCode.KAFKA_CLIENT_ERROR,
          'Failed to disconnect from Kafka.',
        ),
      );

      expect(mockKafkajsConsumer.disconnect).toHaveBeenCalledWith();
    });
  });
});
