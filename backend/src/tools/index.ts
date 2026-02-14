import prisma from "../lib/prisma.js";
import { tool, zodSchema } from "ai";
import { z } from "zod";

// Support Tools
export const supportTools: any = {
  getConversationHistory: tool({
    description: "Get the conversation history for a specific conversation ID",
    inputSchema: zodSchema(z.object({
      conversationId: z
        .string()
        .describe("The ID of the conversation to fetch history for"),
    })) as any,
    execute: (async ({ conversationId }: { conversationId: string }) => {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    }) as any,
  }),
};

// Order Tools
export const orderTools: any = {
  getOrderDetails: tool({
    description: "Fetch details of an order by its ID",
    inputSchema: zodSchema(z.object({
      orderId: z.string().describe("The ID of the order"),
    })) as any,
    execute: (async ({ orderId }: { orderId: string }) => {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) return { error: "Order not found" };
      return { ...order, items: JSON.parse(order.items) };
    }) as any,
  }),
  getDeliveryStatus: tool({
    description:
      "Check the delivery status and tracking information for an order",
    inputSchema: zodSchema(z.object({
      orderId: z.string().describe("The ID of the order"),
    })) as any,
    execute: (async ({ orderId }: { orderId: string }) => {
      const finalOrderId = orderId;
      const order: any = await prisma.order.findUnique({
        where: { id: finalOrderId },
        select: { status: true, trackingNumber: true, estimatedArrival: true, items: true },
      });
      if (!order) return `Order ${finalOrderId} not found.`;

      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

      return `
Your order ${finalOrderId} is ${order.status}.
Tracking Number: ${order.trackingNumber ?? "Not available"}
Estimated Arrival: ${order.estimatedArrival ?? "Not available"}
Items: ${items.map((i: any) => i.name).join(", ")}
  `;
    }) as any,
  }),
};

// Billing Tools
export const billingTools: any = {
  getInvoiceDetails: tool({
    description: "Get invoice details for an order",
    inputSchema: zodSchema(z.object({
      orderId: z
        .string()
        .describe("The ID of the order to get the invoice for"),
    })) as any,
    execute: (async ({ orderId }: { orderId: string }) => {
      const invoice = await prisma.invoice.findFirst({
        where: { orderId },
      });
      if (!invoice) return { error: "Invoice not found" };
      return invoice;
    }) as any,
  }),
  getRefundStatus: tool({
    description: "Check the refund status for a specific invoice or payment",
    inputSchema: zodSchema(z.object({
      invoiceId: z.string().describe("The ID of the invoice"),
    })) as any,
    execute: (async ({ invoiceId }: { invoiceId: string }) => {
      const payment = await prisma.payment.findFirst({
        where: { invoiceId, status: "REFUNDED" },
      });
      if (payment)
        return {
          status: "REFUNDED",
          amount: payment.amount,
          date: payment.createdAt,
        };
      return { status: "NO_REFUND_FOUND" };
    }) as any,
  }),
};
