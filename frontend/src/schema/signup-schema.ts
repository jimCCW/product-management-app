import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignupFormData = z.infer<typeof signupSchema>;
