import crypto from 'node:crypto';

export default class EncryptionHelper {
  private readonly algorithm: string;

  private readonly key: string;

  private readonly iv: string;

  constructor(
    algorithm: string,
    key: string,
    iv: string,
  ) {
    this.algorithm = algorithm;
    this.key = key;
    this.iv = iv;
  }

  encrypt(value: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    return Buffer.from(
      cipher.update(value, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64');
  }

  decrypt(value: string): string {
    const buff = Buffer.from(value, 'base64');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8');
  }
}
