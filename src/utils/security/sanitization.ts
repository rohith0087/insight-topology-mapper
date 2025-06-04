
// Input sanitization utilities

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
