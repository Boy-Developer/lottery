const CryptoJS = require('crypto-js');
const { DateUtil } = require("../util/dateUtil");

// Function to derive a key from a password and salt
function deriveKey(password, salt) {
    return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 100 });
}

// Function to decrypt data with expiration check
function decrypt(encryptedData, password) {
    try {
        // Extract salt, iv, expiration time, and encrypted data
        const saltHex = encryptedData.substr(0, 32); // First 32 characters for salt
        const ivHex = encryptedData.substr(32, 32);  // Next 32 characters for IV
        const expirationTimeHex = encryptedData.substr(64, 10); // Next 10 characters for expiration
        const encryptedHex = encryptedData.substr(74); // Remaining characters

        // Convert hex to WordArray
        const salt = CryptoJS.enc.Hex.parse(saltHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const expirationTime = parseInt(expirationTimeHex, 10);
        const encrypted = CryptoJS.enc.Base64.parse(encryptedHex);

        // Check expiration
        const currentTime = Math.floor(new DateUtil().getCurrentTime().timestamp);
        // console.log('currentTime ::::: ' + currentTime);
        // console.log('expirationTime ::::: ' + expirationTime);
        if (currentTime > expirationTime) {
            return "expired";
        }

        // Derive key and decrypt
        const key = deriveKey(password, salt);
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encrypted },
            key,
            { iv: iv }
        );

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        // Check if decryption failed (empty string = wrong key or format)
        if (!decryptedText) {
            return "invalid";
        }

        return decryptedText;
    } catch (error) {
        console.error('Decryption error:', error);
        return "error";
    }
};

// Function to encrypt data with expiration check
function encrypt(data, password, expirationMinutes) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8); // Generate random salt
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 100 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // Generate random IV

    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });

    // Get current timestamp and calculate expiration timestamp
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = currentTime + expirationMinutes * 60; // Expiration time in seconds

    // Combine salt, iv, expiration time, and encrypted data
    const combined = salt.toString() + iv.toString() + expirationTime.toString() + encrypted.toString();
    return combined; // Return combined string
};

// Function to decrypt password
function decryptPwd(encryptedData, password){
    try {
        // Extract salt, iv, expiration time, and encrypted data
        const saltHex = encryptedData.substr(0, 32); // First 32 characters for salt
        const ivHex = encryptedData.substr(32, 32);  // Next 32 characters for IV
        const encryptedHex = encryptedData.substr(64); // Remaining characters

        // Convert hex to WordArray
        const salt = CryptoJS.enc.Hex.parse(saltHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const encrypted = CryptoJS.enc.Base64.parse(encryptedHex);

        // Derive key and decrypt
        const key = deriveKey(password, salt);
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encrypted },
            key,
            { iv: iv }
        );

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        // Check if decryption failed (empty string = wrong key or format)
        if (!decryptedText) {
            return "invalid";
        }

        return decryptedText;
    } catch (error) {
        console.error('Decryption error:', error);
        return "error";
    }
};
module.exports = { encrypt, decrypt, decryptPwd };