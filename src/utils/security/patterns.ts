
// Security patterns for detecting various types of attacks

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
