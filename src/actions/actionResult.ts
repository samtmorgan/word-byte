import { z } from 'zod';

export type ActionErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'DUPLICATE'
  | 'INIT_FAILED'
  | 'INTERNAL_ERROR';

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: ActionErrorCode };

export function ok<T = void>(data?: T): ActionResult<T> {
  return { success: true, data: data as T };
}

export function fail(code: ActionErrorCode, error: string): ActionResult<never> {
  return { success: false, error, code };
}

export async function safeAction<TInput, TOutput = void>(
  schema: z.ZodType<TInput>,
  rawInput: unknown,
  handler: (input: TInput) => Promise<ActionResult<TOutput>>,
): Promise<ActionResult<TOutput>> {
  const parsed = schema.safeParse(rawInput);
  if (!parsed.success) {
    console.error('[safeAction] Validation failed:', parsed.error.issues);
    return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid input');
  }
  try {
    return await handler(parsed.data);
  } catch (err) {
    if (err instanceof Error && err.message.includes('no auth')) {
      return fail('AUTH_ERROR', 'Authentication required');
    }
    console.error('[safeAction]', err);
    return fail('INTERNAL_ERROR', 'An unexpected error occurred');
  }
}
