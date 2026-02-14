import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = async (err: Error, c: Context) => {
    // Only log the message to avoid issues with circular structures or large objects
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[ErrorHandler]: ${errorMessage}`);

    const isDevelopment = process.env.NODE_ENV === 'development';
    const origin = c.req.header("Origin");

    const addCorsHeaders = (context: Context) => {
        if (origin) {
            context.header("Access-Control-Allow-Origin", origin);
            context.header("Access-Control-Allow-Credentials", "true");
        } else {
            context.header("Access-Control-Allow-Origin", "*");
        }
        context.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, x-conversation-id");
    };

    if (err instanceof HTTPException) {
        try {
            const resp = err.getResponse();
            // Create a new response with headers because Hono's Response object headers might be immutable or difficult to modify directly here
            // Actually, we can just use c.header before returning or modify the response headers
            addCorsHeaders(c);
            return resp;
        } catch (respErr) {
            console.error('[ErrorHandler] Failed to get response from HTTPException', respErr);
        }
    }

    addCorsHeaders(c);

    return c.json(
        {
            success: false,
            message: errorMessage || 'Internal Server Error',
            stack: isDevelopment ? err.stack : undefined,
        },
        500
    );
};
