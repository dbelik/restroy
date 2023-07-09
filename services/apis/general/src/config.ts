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
};
