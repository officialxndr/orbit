import * as Crypto from 'expo-crypto';

/** Stable UUID v4 for entity/reminder/etc. ids. */
export function newId(): string {
  return Crypto.randomUUID();
}
