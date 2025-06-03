
// Security utilities for input validation and sanitization

export const securityPatterns = {
  // SQL Injection patterns
  sqlInjection: [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /xp_/i,
    /sp_/i,
    /select\s+.*\s+from/i,
    /;\s*drop/i,
    /;\s*delete/i,
    /;\s*update/i,
    /;\s*insert/i,
    /'\s*or\s*'1'\s*=\s*'1/i,
    /'\s*or\s*1\s*=\s*1/i,
    /--/,
    /\/\*/,
    /\*\//,
  ],
  
  // XSS patterns
  xss: [
    /<script/i,
    /<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /onfocus\s*=/i,
    /onblur\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /expression\s*\(/i,
  ],
  
  // Directory traversal patterns
  directoryTraversal: [
    /\.\.\//,
    /\.\.\\/, 
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%2e%2e/i,
    /\.\.\\/,
    /\/\.\./,
    /\\\.\./,
  ],
  
  // Command injection patterns
  commandInjection: [
    /;\s*cat\s+/i,
    /;\s*ls\s+/i,
    /;\s*dir\s+/i,
    /;\s*type\s+/i,
    /;\s*echo\s+/i,
    /;\s*pwd/i,
    /;\s*whoami/i,
    /;\s*id/i,
    /;\s*uname/i,
    /\|\s*cat\s+/i,
    /\|\s*ls\s+/i,
    /\|\s*dir\s+/i,
    /`.*`/,
    /\$\(.*\)/,
  ],
};

export const sanitizeInput = (input: string, options: {
  maxLength?: number;
  allowSpecialChars?: boolean;
  preserveSpaces?: boolean;
} = {}): string => {
  if (!input || typeof input !== 'string') return '';
  
  const { maxLength = 1000, allowSpecialChars = false, preserveSpaces = true } = options;
  
  let sanitized = input;
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, maxLength);
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove or escape dangerous characters
  if (!allowSpecialChars) {
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/['"`;]/g, '') // Remove quotes and semicolons
      .replace(/[\\]/g, '') // Remove backslashes
      .replace(/\r?\n/g, ''); // Remove line breaks
  }
  
  if (!preserveSpaces) {
    sanitized = sanitized.replace(/\s+/g, ' '); // Normalize whitespace
  }
  
  return sanitized;
};

export const validateInput = (input: string, type: 'email' | 'password' | 'username' | 'text' = 'text'): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'string') {
    errors.push('Input is required');
    return { isValid: false, errors };
  }
  
  // Check for dangerous patterns
  const allPatterns = [
    ...securityPatterns.sqlInjection,
    ...securityPatterns.xss,
    ...securityPatterns.directoryTraversal,
    ...securityPatterns.commandInjection,
  ];
  
  for (const pattern of allPatterns) {
    if (pattern.test(input)) {
      errors.push('Invalid characters detected');
      break;
    }
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
      if (input.length > 254) {
        errors.push('Email too long');
      }
      break;
      
    case 'password':
      if (input.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (input.length > 128) {
        errors.push('Password too long');
      }
      break;
      
    case 'username':
      if (input.length < 3) {
        errors.push('Username must be at least 3 characters');
      }
      if (input.length > 50) {
        errors.push('Username too long');
      }
      if (!/^[a-zA-Z0-9_.-]+$/.test(input)) {
        errors.push('Username contains invalid characters');
      }
      break;
      
    case 'text':
      if (input.length > 1000) {
        errors.push('Text too long');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const secureHash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Check if under limit
    if (record.count < this.maxAttempts) {
      record.count++;
      record.lastAttempt = now;
      return true;
    }
    
    return false;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}
