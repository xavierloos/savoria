import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1, 'Cart cannot be empty'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
