import { checkSpelling } from './spellCheck';

global.fetch = jest.fn();

describe('checkSpelling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns valid: true when word is found in dictionary', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200 });

    const result = await checkSpelling('hello');

    expect(result).toEqual({ valid: true });
    expect(fetch).toHaveBeenCalledWith('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
  });

  it('returns valid: false when word is not found (404)', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 });

    const result = await checkSpelling('xyznotaword');

    expect(result).toEqual({ valid: false });
  });

  it('returns valid: true as fallback when API returns non-404 error', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    const result = await checkSpelling('hello');

    expect(result).toEqual({ valid: true });
  });

  it('returns valid: true as fallback when fetch throws', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await checkSpelling('hello');

    expect(result).toEqual({ valid: true });
  });
});
