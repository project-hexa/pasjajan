import { z } from "zod";

export const customerAnalyticSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  data: z.object({
    period: z.object({ filter: z.string(), from: z.string(), to: z.string() }),
    summary: z.object({
      total_customers: z.object({
        value: z.number(),
        trend: z.string(),
        description: z.string(),
      }),
      total_transactions: z.object({
        value: z.string(),
        trend: z.string(),
        description: z.string(),
      }),
      avg_transaction: z.object({
        value: z.string(),
        trend: z.string(),
        description: z.string(),
      }),
    }),
    analytics: z.object({
      purchase_trend: z.array(
        z.object({
          date: z.string(),
          label: z.string(),
          transactions: z.number(),
          revenue: z.string(),
        }),
      ),
      category_composition: z.array(
        z.object({
          category: z.string(),
          quantity: z.number(),
          percentage: z.number(),
        }),
      ),
      purchase_frequency: z.array(
        z.object({
          period: z.string(),
          month: z.number(),
          year: z.number(),
          transactions: z.number(),
        }),
      ),
    }),
  }),
});

export type CustomerAnalyticResponse = z.infer<typeof customerAnalyticSchema>;

export const customerListSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  data: z.object({
    customers: z.array(
      z.object({
        customer_name: z.string(),
        transaction_date: z.string(),
        total_items: z.number(),
        total_payment: z.string(),
      }),
    ),
    pagination: z.object({
      current_page: z.number(),
      per_page: z.number(),
      total: z.number(),
      last_page: z.number(),
      from: z.number(),
      to: z.number(),
    }),
  }),
});

export type CustomerListResponse = z.infer<typeof customerListSchema>;
