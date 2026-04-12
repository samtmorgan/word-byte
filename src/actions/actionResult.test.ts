import { z } from 'zod';
import { ok, fail, safeAction } from './actionResult';

describe('actionResult', () => {
  describe('ok', () => {
    it('returns success with no data', () => {
      expect(ok()).toEqual({ success: true, data: undefined });
    });

    it('returns success with data', () => {
      expect(ok('hello')).toEqual({ success: true, data: 'hello' });
    });
  });

  describe('fail', () => {
    it('returns failure with code and error', () => {
      expect(fail('VALIDATION_ERROR', 'bad input')).toEqual({
        success: false,
        code: 'VALIDATION_ERROR',
        error: 'bad input',
      });
    });
  });

  describe('safeAction', () => {
    const schema = z.string().min(1);

    it('returns VALIDATION_ERROR for invalid input', async () => {
      const handler = jest.fn();

      const result = await safeAction(schema, '', handler);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('VALIDATION_ERROR');
      }
      expect(handler).not.toHaveBeenCalled();
    });

    it('passes validated input to handler', async () => {
      const handler = jest.fn().mockResolvedValue(ok());

      const result = await safeAction(schema, 'valid', handler);

      expect(result).toEqual({ success: true, data: undefined });
      expect(handler).toHaveBeenCalledWith('valid');
    });

    it('returns handler result on success', async () => {
      const handler = jest.fn().mockResolvedValue(ok('data'));

      const result = await safeAction(schema, 'valid', handler);

      expect(result).toEqual({ success: true, data: 'data' });
    });

    it('catches handler throws and returns INTERNAL_ERROR', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const handler = jest.fn().mockRejectedValue(new Error('unexpected'));

      const result = await safeAction(schema, 'valid', handler);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('INTERNAL_ERROR');
      }
      consoleSpy.mockRestore();
    });

    it('returns AUTH_ERROR for auth-related throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const handler = jest.fn().mockRejectedValue(new Error('no auth userAuthId found'));

      const result = await safeAction(schema, 'valid', handler);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('AUTH_ERROR');
      }
      consoleSpy.mockRestore();
    });
  });
});
