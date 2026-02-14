import prisma from "../lib/prisma.js";
import { tool, zodSchema } from "ai";
import { z } from "zod";
// Support Tools
export const supportTools = {
    getConversationHistory: tool({
        description: "Get the conversation history for a specific conversation ID",
        inputSchema: zodSchema(z.object({
            conversationId: z
                .string()
                .describe("The ID of the conversation to fetch history for"),
        })),
        execute: (async ({ conversationId }) => {
            const messages = await prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: "asc" },
            });
            return messages;
        }),
    }),
};
// Order Tools
export const orderTools = {
    getOrderDetails: tool({
        description: "Fetch details of an order by its ID",
        inputSchema: zodSchema(z.object({
            orderId: z.string().describe("The ID of the order"),
        })),
        execute: (async ({ orderId }) => {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
            });
            if (!order)
                return { error: "Order not found" };
            return { ...order, items: JSON.parse(order.items) };
        }),
    }),
    getDeliveryStatus: tool({
        description: "Check the delivery status and tracking information for an order",
        inputSchema: zodSchema(z.object({
            orderId: z.string().describe("The ID of the order"),
        })),
        execute: (async ({ orderId }) => {
            const finalOrderId = orderId;
            const order = await prisma.order.findUnique({
                where: { id: finalOrderId },
                select: { status: true, trackingNumber: true, estimatedArrival: true, items: true },
            });
            if (!order)
                return `Order ${finalOrderId} not found.`;
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            return `
Your order ${finalOrderId} is ${order.status}.
Tracking Number: ${order.trackingNumber ?? "Not available"}
Estimated Arrival: ${order.estimatedArrival ?? "Not available"}
Items: ${items.map((i) => i.name).join(", ")}
  `;
        }),
    }),
};
// Billing Tools
export const billingTools = {
    getInvoiceDetails: tool({
        description: "Get invoice details for an order",
        inputSchema: zodSchema(z.object({
            orderId: z
                .string()
                .describe("The ID of the order to get the invoice for"),
        })),
        execute: (async ({ orderId }) => {
            const invoice = await prisma.invoice.findFirst({
                where: { orderId },
            });
            if (!invoice)
                return { error: "Invoice not found" };
            return invoice;
        }),
    }),
    getRefundStatus: tool({
        description: "Check the refund status for a specific invoice or payment",
        inputSchema: zodSchema(z.object({
            invoiceId: z.string().describe("The ID of the invoice"),
        })),
        execute: (async ({ invoiceId }) => {
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
        }),
    }),
};
