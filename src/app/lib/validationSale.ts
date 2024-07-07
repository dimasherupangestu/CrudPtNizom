import { z } from "zod";

export const saleSchema = z.object({
  transaction_date: z.string().nonempty("transaction date is required"),
  customer_name: z.string().nonempty("Customer name is required"),
  invoice_id: z.string().nonempty("Invoice ID is required"),
  subtotal: z.number(),
  tax: z.string().regex(/^\d+%$/, "Tax must be a number followed by %"),
  discount: z
    .string()
    .regex(/^\d+%$/, "Discount must be a number followed by %"),
  total_price: z.number(),
  detail: z
    .array(
      z.object({
        product_id: z.number().or(z.string()),
        quantity: z.string().or(z.number()),
        price: z.number().min(0),
      })
    )
    .min(2, "At least two products are required"),
});
