/**
 * PHI Field-Level Encryption (HIPAA 164.312(a)(2)(iv))
 *
 * AES-256-GCM authenticated encryption for PHI/PII fields.
 * Supports key rotation via key ID versioning.
 *
 * Required environment variables:
 *   PHI_ENCRYPTION_KEY    - 256-bit hex key (64 hex chars)
 *   PHI_ENCRYPTION_KEY_ID - Version ID for current key (e.g., "v1")
 *   PHI_HMAC_KEY          - Separate 256-bit hex key for search hashes
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.PHI_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("PHI_ENCRYPTION_KEY environment variable is required for HIPAA compliance");
  }
  if (key.length !== 64) {
    throw new Error("PHI_ENCRYPTION_KEY must be a 64-character hex string (256 bits)");
  }
  return Buffer.from(key, "hex");
}

function getHmacKey(): Buffer {
  const key = process.env.PHI_HMAC_KEY;
  if (!key) {
    throw new Error("PHI_HMAC_KEY environment variable is required for HIPAA compliance");
  }
  return Buffer.from(key, "hex");
}

export function getCurrentKeyId(): string {
  return process.env.PHI_ENCRYPTION_KEY_ID || "v1";
}

/**
 * Check if encryption is configured. Returns false during initial setup
 * before env vars are set, allowing the app to start without encryption
 * for migration purposes.
 */
export function isEncryptionConfigured(): boolean {
  return !!(process.env.PHI_ENCRYPTION_KEY && process.env.PHI_HMAC_KEY);
}

/**
 * Encrypt a plaintext string. Returns format: keyId:iv:ciphertext:authTag (all base64)
 */
export function encryptField(plaintext: string): string {
  if (!isEncryptionConfigured()) {
    return plaintext; // Pass through if not configured (migration mode)
  }

  const key = getEncryptionKey();
  const keyId = getCurrentKeyId();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${keyId}:${iv.toString("base64")}:${encrypted.toString("base64")}:${authTag.toString("base64")}`;
}

/**
 * Decrypt an encrypted field string. Handles both encrypted (keyId:iv:ct:tag)
 * and plaintext (legacy unencrypted) values.
 */
export function decryptField(value: string): string {
  if (!value) return value;

  // Check if this is an encrypted value (format: keyId:iv:ciphertext:authTag)
  const parts = value.split(":");
  if (parts.length !== 4) {
    // Not encrypted -- return as-is (legacy plaintext data)
    return value;
  }

  if (!isEncryptionConfigured()) {
    return value; // Can't decrypt without keys
  }

  const [_keyId, ivB64, ciphertextB64, authTagB64] = parts;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Deterministic HMAC-SHA256 hash for searchable encrypted fields.
 * Allows exact-match lookups without decrypting all records.
 */
export function hashForSearch(plaintext: string): string {
  if (!isEncryptionConfigured()) {
    return ""; // No hash without HMAC key
  }

  const key = getHmacKey();
  return crypto.createHmac("sha256", key).update(plaintext.toLowerCase().trim()).digest("hex");
}
