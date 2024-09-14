import { publicEncrypt, constants } from "crypto";
export const encrypted = (password) => {
  const encryptedData = publicEncrypt(
    {
      key: process.env.RSA_PUBLIC_KEY,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // Convert the data string to a buffer using `Buffer.from`
    Buffer.from(password)
  );

  return encryptedData.toString("base64");
};
