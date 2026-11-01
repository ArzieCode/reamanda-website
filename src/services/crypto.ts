// ============================================================
// Service — Web Crypto PBKDF2 Password Hashing & Token Utility
// ============================================================

const PBKDF2_ITERATIONS = 100000;
const HASH_ALGORITHM = 'SHA-256';

/**
 * Generate a cryptographically secure random salt hex string
 */
export function generateSalt(byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash password with Web Crypto PBKDF2 and salt
 */
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time safe password verification
 */
export async function verifyPassword(
  passwordAttempt: string,
  saltHex: string,
  storedHashHex: string
): Promise<boolean> {
  try {
    const attemptHash = await hashPassword(passwordAttempt, saltHex);
    if (attemptHash.length !== storedHashHex.length) return false;
    let match = 0;
    for (let i = 0; i < attemptHash.length; i++) {
      match |= attemptHash.charCodeAt(i) ^ storedHashHex.charCodeAt(i);
    }
    return match === 0;
  } catch (err) {
    console.error('Password verification failed:', err);
    return false;
  }
}

/**
 * Password strength checker with Indonesian feedback
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Sangat Lemah' | 'Lemah' | 'Cukup' | 'Kuat';
  color: string;
  feedback: string[];
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  if (password.length < 8) {
    feedback.push('Minimal 8 karakter');
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score++;
  if (hasLower && hasUpper) score++;
  if (hasDigit) score++;
  if (hasSpecial) score++;

  if (!hasLower || !hasUpper) {
    feedback.push('Gunakan kombinasi huruf besar & kecil');
  }
  if (!hasDigit) {
    feedback.push('Sertakan angka');
  }
  if (!hasSpecial) {
    feedback.push('Sertakan simbol (@$!%*?&)');
  }

  let label: PasswordStrength['label'] = 'Sangat Lemah';
  let color = 'var(--status-occupied)';

  if (score === 2) {
    label = 'Lemah';
    color = 'var(--status-occupied)';
  } else if (score === 3) {
    label = 'Cukup';
    color = 'var(--caramel)';
  } else if (score >= 4) {
    label = 'Kuat';
    color = 'var(--status-available)';
  }

  return {
    score,
    label,
    color,
    feedback,
    isValid: password.length >= 8,
  };
}

/**
 * Generate a random temporary password (e.g. for reset password)
 */
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pass = 'RM-';
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass + '!';
}
