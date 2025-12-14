import z from "zod";

export const reportSalesSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    parameters: z.object({
      period: z.string(),
      store_id: z.number().nullable().optional(),
      top_n: z.number(),
      date_range: z.object({ from: z.string(), to: z.string() }),
    }),
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
    salesTrend: z.array(
      z.object({
        label: z.number(),
        date: z.string(),
        value: z.number(),
        revenue: z.string(),
      }),
    ),
    topProducts: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        unitSold: z.number(),
        revenue: z.string(),
      }),
    ),
  }),
});

export type ReportSalesResponse = z.infer<typeof reportSalesSchema>;
