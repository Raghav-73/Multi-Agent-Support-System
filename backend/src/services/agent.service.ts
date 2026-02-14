import { google } from "@ai-sdk/google";
import { streamText, generateText, ToolSet, tool, zodSchema } from "ai";
import { supportTools, orderTools, billingTools } from "../tools/index.js";
import prisma from "../lib/prisma.js";
import z from "zod";

export class AgentService {
  async handleMessage(
    conversationId: string,
    message: string,
    extractedOrderId?: string,
  ) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    const context = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const { text: intent } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an intent classification agent. Categorize the user's message into one of these categories:
      - SUPPORT: General help, account issues, or basic platform questions.
      - ORDER_MANAGEMENT: Questions about specific orders, delivery, or order history.
      - BILLING: Questions about invoices, payments, or refunds.
      - UNKNOWN: If the intent doesn't fit any category.
      
      User Message: "${message}"
      Context: "${context}"
      
      Return ONLY the category name.`,
      prompt: message,
    });

    let tools: any = {};

    if (intent === "SUPPORT") {
      tools = { ...supportTools };
    } else if (intent === "ORDER_MANAGEMENT") {
      if (extractedOrderId) {
        tools = {
          getOrderDetails: tool({
            description: "Fetch details of an order by its ID",
            inputSchema: zodSchema(
              z.object({
                orderId: z.string().optional().describe("The ID of the order"),
              }),
            ) as any,
            execute: (async ({ orderId }: { orderId?: string }) => {
              const finalOrderId = orderId || extractedOrderId;
              console.log("Using orderId for getOrderDetails:", finalOrderId);

              const order = await prisma.order.findUnique({
                where: { id: finalOrderId },
              });
              if (!order) return { error: "Order not found" };
              return { ...order, items: JSON.parse(order.items) };
            }) as any,
          }),
          getDeliveryStatus: tool({
            description:
              "Check the delivery status and tracking information for an order",
            inputSchema: zodSchema(
              z.object({
                orderId: z.string().optional().describe("The ID of the order"),
              }),
            ) as any,
            execute: (async ({ orderId }: { orderId?: string }) => {
              const finalOrderId = orderId || extractedOrderId;
              console.log("Using orderId for getDeliveryStatus:", finalOrderId);

              if (!finalOrderId) {
                return "Please provide a valid order ID like ORD-101.";
              }

              const order = await prisma.order.findUnique({
                where: { id: finalOrderId },
                select: {
                  status: true,
                  trackingNumber: true,
                  estimatedArrival: true,
                },
              });

              if (!order) return `Order ${finalOrderId} not found.`;

              return `
Your order ${finalOrderId} is ${order.status}.
Tracking Number: ${order.trackingNumber ?? "Not available"}
Estimated Arrival: ${order.estimatedArrival ?? "Not available"}
        `;
            }) as any,
          }),
        };
      } else {
        tools = { ...orderTools };
      }
    } else if (intent === "BILLING") {
      tools = { ...billingTools };
    }

    return streamText({
      model: google("gemini-2.0-flash"),
      system: `You are a helpful customer support agent for a multi-agent support system.
      Your current specialized role is: ${intent}.
      ${extractedOrderId ? `Current context: Help the user with Order ID: ${extractedOrderId}` : ""}
      
      Instructions:
      1. Use the provided tools to fetch real data when needed.
      2. If you don't have enough information, ask the user politely.
      3. Be professional and concise.
      4. If the user intent seems to have changed, handle it gracefully.`,
      messages: [
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: message },
      ],
      tools: tools,
      onFinish: async ({ text }) => {
        const finalText = text;
        await prisma.message.create({
          data: {
            conversationId,
            role: "assistant",
            content: finalText,
            agentType: intent,
          },
        });
      },
    });
  }
}

const agentService = new AgentService();
export default agentService;
