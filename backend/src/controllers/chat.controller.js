import prisma from "../lib/prisma.js";
import agentService from "../services/agent.service.js";

export const sendMessage = async (c) => {
    try {
        const { messages, conversationId } = await c.req.json();
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage.content;

        let cid = conversationId;

        if (!cid) {
            const conversation = await prisma.conversation.create({
                data: { title: content.substring(0, 50) },
            });
            cid = conversation.id;
        }

        console.log("Message api reached to agent service");

        const result = await agentService.handleMessage(cid, content);

        const response = result.toTextStreamResponse({
            headers: {
                "x-conversation-id": cid,
            },
        });

        return response;
    } catch (error) {
        console.log("Internal Server Error", error);
        return c.json({ message: "Internal Server Error", error }, 500);
    }
};

export const getConversation = async (c) => {
    const id = c.req.param("id");
    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) return c.json({ error: "Conversation not found" }, 404);
    return c.json(conversation);
};

export const listConversations = async (c) => {
    const conversations = await prisma.conversation.findMany({
        orderBy: { updatedAt: "desc" },
    });
    return c.json(conversations);
};

export const deleteConversation = async (c) => {
    const id = c.req.param("id");
    await prisma.conversation.delete({ where: { id } });
    return c.json({ success: true });
};
