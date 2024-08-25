import * as CryptoJS from 'crypto-js';

export const encryptData = (data: string, passphrase: string) => {
  return CryptoJS.AES.encrypt(data, passphrase).toString();
};

export const decryptData = (encryptedData: string, passphrase: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};
