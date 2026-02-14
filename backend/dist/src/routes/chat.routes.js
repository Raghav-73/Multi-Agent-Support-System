import { Hono } from 'hono';
import { sendMessage, getConversation, listConversations, deleteConversation } from '../controllers/chat.controller.js';
const chat = new Hono();
chat.post('/', sendMessage);
chat.get('/conversations/:id', getConversation);
chat.get('/conversations', listConversations);
chat.delete('/conversations/:id', deleteConversation);
export default chat;
