import { decryptText, encryptText } from "./crypto";

const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure;samesite=strict`;
};

export const setSavedEmail = (email, days = 30) => {
  setCookie("rememberEmail", email, days);
};

export const getSavedEmail = () => {
  return getCookie("rememberEmail");
};

export const clearSavedEmail = () => {
  deleteCookie("rememberEmail");
};

export const setSavedPassword = (password, days = 30) => {
  const encryptedPassword = encryptText(password);
  setCookie("rememberPassword", encryptedPassword, days);
};

export const getSavedPassword = () => {
  const encryptedPassword = getCookie("rememberPassword");
  if (encryptedPassword) {
    return decryptText(encryptedPassword);
  }
  return null;
};

export const clearSavedPassword = () => {
  deleteCookie("rememberPassword");
};
