import { Global, Module } from '@nestjs/common';
import { DatabaseClient } from '@restroy/core';

import config from './config';

const databaseProvider = {
  provide: config.database.simplePool.providerName,
  useFactory: async () => {
    const database = new DatabaseClient(
      config.database.simplePool.user,
      config.database.simplePool.host,
      config.database.simplePool.database,
      config.database.simplePool.password,
      config.database.simplePool.port,
    );
    await database.init();
    return database;
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export default class DatabaseModule {}
