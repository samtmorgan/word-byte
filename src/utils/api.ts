export const composeApiUrl = (endpoint: 'currentWords' | 'healthCheck') => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const currentWordsPath = process.env.NEXT_PUBLIC_API_PATH_CURRENT_WORDS;
  const healthCheckPath = process.env.NEXT_PUBLIC_API_PATH_HEALTH_CHECK;

  return `${baseUrl}/${endpoint === 'currentWords' ? currentWordsPath : healthCheckPath}`;
};
