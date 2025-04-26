import { EncryptStorage } from 'encrypt-storage';

export const encryptedStorage = new EncryptStorage('YOUR_SECRET_KEY', {
  storageType: 'localStorage'
});
