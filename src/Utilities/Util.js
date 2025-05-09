import CryptoJS from 'crypto-js';

export const encrypt = (inputText) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
    return encrypted;
}

export const decrypt = (encryptedText) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
}