interface DynamicRule {
  pattern: string;
  sign: string;
  time: number;
}

export async function generateDynamicRules(): Promise<DynamicRule[]> {
  const timestamp = Math.floor(Date.now() / 1000);
  const patterns = [
    '/api/v1/content/*',
    '/api/v1/users/*',
    '/api/v1/messages/*'
  ];

  return patterns.map(pattern => ({
    pattern,
    sign: generateSignature(pattern, timestamp),
    time: timestamp
  }));
}

function generateSignature(pattern: string, timestamp: number): string {
  // Implementation based on deviint/onlyfans-dynamic-rules
  const key = process.env.VITE_APP_SECRET_KEY || '';
  const message = `${pattern}:${timestamp}`;
  
  // Use Web Crypto API for HMAC-SHA256
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const keyData = encoder.encode(key);
  
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => crypto.subtle.sign(
    'HMAC',
    key,
    data
  )).then(signature => {
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  });
}