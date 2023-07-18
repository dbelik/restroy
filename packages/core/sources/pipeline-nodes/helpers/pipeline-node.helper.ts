import { Inject, Injectable } from '@nestjs/common';

import { EncryptionHelper } from '../../common';

@Injectable()
export default class PipelineNodeHelper {
  constructor(
    @Inject('ENCRYPTION') private readonly encryptionHelper: EncryptionHelper,
  ) {}

  decryptNodeSettings(settings: string): object {
    return JSON.parse(this.encryptionHelper.decrypt(settings)) as object;
  }

  encryptNodeSettings(settings: object): string {
    return this.encryptionHelper.encrypt(JSON.stringify(settings));
  }
}
