import * as crypto from 'crypto';

/**
 * Creates a secure hash of sensitive data
 * @param data The string to hash
 * @returns Hashed string
 */
export const hashSensitiveData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};
