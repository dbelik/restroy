import { NodeEnvConfig } from '@restroy/config-utils';

const config = new NodeEnvConfig(process.env);

export default {
  database: {
    simplePool: {
      providerName: 'DATABASE_POSTGRES',
      user: config.get('DATABASE_SIMPLEPOOL_USER', 'restroy_admin'),
      host: config.get('DATABASE_SIMPLEPOOL_HOST', 'localhost'),
      database: config.get('DATABASE_SIMPLEPOOL_DATABASE', 'restroy'),
      password: config.get('DATABASE_SIMPLEPOOL_PASSWORD', 'password123'),
      port: Number.parseInt(config.get('DATABASE_SIMPLEPOOL_PORT', '6000'), 10),
    },
  },

  encryption: {
    providerName: 'ENCRYPTION',
    algorithm: config.get('ENCRYPTION_ALGORITHM', 'aes-256-cbc'),
    key: config.get('ENCRYPTION_KEY', '12345678901234567890123456789012'),
    iv: config.get('ENCRYPTION_IV', '1234567890123456'),
  },
};
