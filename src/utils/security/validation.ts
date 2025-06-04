
// Input validation utilities
import { securityPatterns } from './patterns';

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
