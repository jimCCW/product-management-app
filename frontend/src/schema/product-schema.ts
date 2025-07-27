import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce
    .number('Price must be a number')
    .min(0.01, 'Price must be greater than 0'),
  stock: z.coerce
    .number('Stock must be a number')
    .int('Stock must be an integer')
    .min(0, 'Stock must be 0 or more'),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
