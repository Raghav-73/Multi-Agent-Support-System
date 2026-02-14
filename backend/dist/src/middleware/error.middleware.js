import { HTTPException } from 'hono/http-exception';
export const errorHandler = async (err, c) => {
    console.error(`[Error]: ${err.message}`);
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    return c.json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    }, 500);
};
