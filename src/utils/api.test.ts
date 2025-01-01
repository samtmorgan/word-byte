import { composeApiUrl } from './api';

describe('composeApiUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
      NEXT_PUBLIC_API_PATH_HEALTH_CHECK: 'healthCheck',
      NEXT_PUBLIC_API_PATH_CURRENT_WORDS: 'words/currentWords',
    };
  });

  it('should compose URL with base URL and endpoint', () => {
    const result = composeApiUrl('currentWords');
    expect(result).toBe('https://api.example.com/words/currentWords');
  });

  it('should handle base URL without trailing slash', () => {
    const result = composeApiUrl('healthCheck');
    expect(result).toBe('https://api.example.com/healthCheck');
  });
});
