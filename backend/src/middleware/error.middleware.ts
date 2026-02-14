import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = async (err: Error, c: Context) => {
    // Only log the message to avoid issues with circular structures or large objects
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[ErrorHandler]: ${errorMessage}`);

    if (err instanceof HTTPException) {
        try {
            return err.getResponse();
        } catch (respErr) {
            console.error('[ErrorHandler] Failed to get response from HTTPException', respErr);
        }
    }

    const isDevelopment = process.env.NODE_ENV === 'development';
    const origin = c.req.header("Origin");

    if (origin) {
        c.header("Access-Control-Allow-Origin", origin);
        c.header("Access-Control-Allow-Credentials", "true");
    } else {
        c.header("Access-Control-Allow-Origin", "*");
    }

    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, x-conversation-id");

    return c.json(
        {
            success: false,
            message: errorMessage || 'Internal Server Error',
            stack: isDevelopment ? err.stack : undefined,
        },
        500
    );
};
