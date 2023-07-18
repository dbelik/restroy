import { Global, Module } from '@nestjs/common';
import { EncryptionHelper } from '@restroy/core';

import config from './config';

const encryptionProvider = {
  provide: config.encryption.providerName,
  useFactory: async () => new EncryptionHelper(
    config.encryption.algorithm,
    config.encryption.key,
    config.encryption.iv,
  ),
};

@Global()
@Module({
  providers: [encryptionProvider],
  exports: [encryptionProvider],
})
export default class EncryptionModule {}
