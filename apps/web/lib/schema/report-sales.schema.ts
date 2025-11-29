import z from "zod";

export const reportSalesSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  data: z.object({
    parameters: z.object({
      period: z.string(),
      store_id: z.null(),
      top_n: z.number(),
      date_range: z.object({ from: z.string(), to: z.string() }),
    }),
    summary: z.object({
      totalRevenue: z.number(),
      formattedRevenue: z.string(),
      totalTransactions: z.number(),
      averageTransactionValue: z.number(),
      formattedAvgTxValue: z.string(),
      totalUnitSold: z.number(),
    }),
    salesTrend: z.array(
      z.object({
        label: z.number(),
        date: z.string(),
        value: z.number(),
        revenue: z.number(),
      }),
    ),
    topProducts: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        unitSold: z.number(),
        revenue: z.number(),
        formattedRevenue: z.string(),
        transactionCount: z.number(),
      }),
    ),
  }),
});

export type ReportSalesResponse = z.infer<typeof reportSalesSchema>;
