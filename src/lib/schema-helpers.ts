import { z } from 'astro/zod';

export function optionalText<T extends z.ZodType>(schema: T) {
  return z
    .union([schema, z.literal(''), z.null()])
    .optional()
    .transform((value) => (value == null || value === '' ? undefined : value));
}

export function optionalNumber(schema: z.ZodNumber) {
  return z
    .union([schema, z.null()])
    .optional()
    .transform((value) => (value == null ? undefined : value));
}
