import { google } from "@ai-sdk/google";
import { streamText, generateText, ToolSet, tool } from "ai";
import { supportTools, orderTools, billingTools } from "../tools/index.js";
import prisma from "../lib/prisma.js";
import z from "zod";

export type AgentType = "SUPPORT" | "ORDER" | "BILLING" | "ROUTER";

class AgentService {
  private model = google("gemini-2.5-flash"); // Optimized for tool use and reasoning

  async classifyIntent(content: string): Promise<AgentType> {
    const { text } = await generateText({
      model: this.model,
      system: `You are a routing agent for a customer support system. 
      Classify the user's intent into one of the following categories:
      - SUPPORT: General inquiries, FAQs, troubleshooting.
      - ORDER: Order status, tracking, modifications, cancellations.
      - BILLING: Payment issues, refunds, invoices, subscription queries.
      
      If the intent is unclear, respond with SUPPORT.
      Output ONLY the category name (SUPPORT, ORDER, or BILLING).`,
      prompt: content,
    });

    const intent = text.trim().toUpperCase() as AgentType;
    return ["SUPPORT", "ORDER", "BILLING"].includes(intent)
      ? intent
      : "SUPPORT";
  }
  async handleMessage(conversationId: string, content: string) {
    // 1. Get conversation history
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    // 2. Extract order ID using regex FIRST
    const orderMatch = content.match(/ORD-\d+/i);
    const extractedOrderId = orderMatch?.[0];
    console.log("Extracted orderId:", extractedOrderId);

    // 3. Classify intent
    const intent = await this.classifyIntent(content);
    console.log(`Delegating to ${intent} agent`);

    // 4. Define agent settings
    let systemPrompt = "";
    let tools: ToolSet = {};

    switch (intent) {
      case "SUPPORT":
        systemPrompt =
          "You are a Support Agent. Help with general inquiries, FAQs, and troubleshooting.";
        tools = supportTools;
        break;

      case "ORDER":
        systemPrompt = `You are an Order Agent. Help with order status, tracking, and modifications.

${
  extractedOrderId
    ? `The user mentioned order ID: ${extractedOrderId}. Use this order ID.`
    : `Ask the user to provide an order ID if they haven't mentioned one.`
}

After receiving tool results, respond clearly to the user.
`;

        // Override tools with extracted orderId if available
        if (extractedOrderId) {
          tools = {
            getOrderDetails: tool({
              description: "Fetch details of an order by its ID",
              parameters: z.object({
                orderId: z.string().optional().describe("The ID of the order"),
              }),
              execute: async ({ orderId }: any) => {
                const finalOrderId = orderId || extractedOrderId;
                console.log("Using orderId for getOrderDetails:", finalOrderId);

                const order = await prisma.order.findUnique({
                  where: { id: finalOrderId },
                });
                if (!order) return { error: "Order not found" };
                return { ...order, items: JSON.parse(order.items) };
              },
            }),
            getDeliveryStatus: tool({
              description:
                "Check the delivery status and tracking information for an order",
              parameters: z.object({
                orderId: z.string().optional().describe("The ID of the order"),
              }),
              execute: async ({ orderId }: any) => {
                const finalOrderId = orderId || extractedOrderId;
                console.log(
                  "Using orderId for getDeliveryStatus:",
                  finalOrderId,
                );

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
              },
            }),
          };
        } else {
          tools = orderTools;
        }
        break;
      case "BILLING":
        systemPrompt =
          "You are a Billing Agent. Help with payments, invoices, and refunds.";
        tools = billingTools;
        break;
    }

    // 5. Stream response
    return streamText({
      model: this.model,
      system: systemPrompt,
      messages: [
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content },
      ],
      tools,
      toolChoice: "auto",
      onFinish: async (result) => {
        let finalText = "";

        const textBlocks = result.content?.filter(
          (block) => block.type === "text",
        );

        if (textBlocks?.length) {
          finalText = textBlocks.map((b) => b.text).join("");
        }

        if (!finalText) {
          const toolResult = result.content?.find(
            (block) => block.type === "tool-result",
          );

          if (toolResult) {
            finalText = toolResult.output;
          }
        }

        console.log("FINAL TEXT:", finalText);

        await prisma.message.create({
          data: {
            conversationId,
            role: "user",
            content,
          },
        });

        await prisma.message.create({
          data: {
            conversationId,
            role: "assistant",
            content: finalText,
            agentType: intent,
          },
        });
        return finalText;
      },
    });
  }
  //   async handleMessage(conversationId: string, content: string) {
  //     // 1. Get conversation history
  //     const history = await prisma.message.findMany({
  //       where: { conversationId },
  //       orderBy: { createdAt: "asc" },
  //     });

  //     // 2. Classify intent
  //     const intent = await this.classifyIntent(content);
  //     console.log(`Delegating to ${intent} agent`);

  //     // 3. Define agent settings
  //     let systemPrompt = "";
  //     let tools: ToolSet = {};

  //     tools = {
  //       ...orderTools,
  //       getDeliveryStatus: {
  //         ...orderTools.getDeliveryStatus,
  //         execute: async (args: any) => {
  //           const finalOrderId = args.orderId || extractedOrderId;

  //           console.log("Using orderId:", finalOrderId);

  //           if (!finalOrderId) {
  //             return "Please provide a valid order ID like ORD-101.";
  //           }

  //           const order = await prisma.order.findUnique({
  //             where: { id: finalOrderId },
  //             select: {
  //               status: true,
  //               trackingNumber: true,
  //               estimatedArrival: true,
  //             },
  //           });

  //           if (!order) return `Order ${finalOrderId} not found.`;

  //           return `
  // Your order ${finalOrderId} is ${order.status}.
  // Tracking Number: ${order.trackingNumber ?? "Not available"}
  // Estimated Arrival: ${order.estimatedArrival ?? "Not available"}
  //       `;
  //         },
  //       },
  //     };

  //     // Extract order ID using regex
  //     const orderMatch = content.match(/ORD-\d+/i);
  //     const extractedOrderId = orderMatch?.[0];

  //     console.log("Extracted orderId:", extractedOrderId);

  //     switch (intent) {
  //       case "SUPPORT":
  //         systemPrompt =
  //           "You are a Support Agent. Help with general inquiries, FAQs, and troubleshooting.";
  //         tools = supportTools;
  //         break;
  //       case "ORDER":
  //         systemPrompt = `You are an Order Agent. Help with order status, tracking, and modifications. You are an Order Agent.

  // ${
  //   extractedOrderId
  //     ? `The user provided order ID: ${extractedOrderId}.
  //      Always use this value as orderId when calling tools.`
  //     : `If no order ID is provided, ask the user to provide one.`
  // }

  // Never call tools without required parameters.
  // Always include orderId when calling getDeliveryStatus or getOrderDetails.

  // After receiving tool results, respond clearly to the user.
  // `;
  //         tools = orderTools;
  //         break;
  //       case "BILLING":
  //         systemPrompt =
  //           "You are a Billing Agent. Help with payments, invoices, and refunds.";
  //         tools = billingTools;
  //         break;
  //     }

  //     // 4. Stream response
  //     return streamText({
  //       model: this.model,
  //       system: systemPrompt,
  //       messages: [
  //         ...history.map((m) => ({
  //           role: m.role as "user" | "assistant",
  //           content: m.content,
  //         })),
  //         { role: "user", content },
  //       ],
  //       tools,
  //       // maxSteps: 5, // Allow tool calling
  //       toolChoice: "auto", // ADD THIS
  //       onFinish: async (result) => {
  //         let finalText = "";

  //         // 1️⃣ If normal text exists
  //         const textBlocks = result.content?.filter(
  //           (block) => block.type === "text",
  //         );

  //         if (textBlocks?.length) {
  //           finalText = textBlocks.map((b) => b.text).join("");
  //         }

  //         // 2️⃣ If no text, use tool-result output
  //         if (!finalText) {
  //           const toolResult = result.content?.find(
  //             (block) => block.type === "tool-result",
  //           );

  //           if (toolResult) {
  //             finalText = toolResult.output;
  //           }
  //         }

  //         console.log("FINAL TEXT:", finalText);

  //         // if (!finalText.trim()) {
  //         //   console.log("⚠️ No final response generated.");
  //         //   return;
  //         // }

  //         await prisma.message.create({
  //           data: {
  //             conversationId,
  //             role: "user",
  //             content,
  //           },
  //         });

  //         await prisma.message.create({
  //           data: {
  //             conversationId,
  //             role: "assistant",
  //             content: finalText,
  //             agentType: intent,
  //           },
  //         });
  //       },
  //     });
  //   }
}

export default new AgentService();
