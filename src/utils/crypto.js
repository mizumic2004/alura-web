import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "default-secret-key";

export function encryptText(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decryptText(encryptedText) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
