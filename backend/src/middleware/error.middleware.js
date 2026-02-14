import { HTTPException } from "hono/http-exception";

export const errorHandler = async (err, c) => {
  console.error("[ErrorHandler]:", err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      success: false,
      message: err?.message || "Internal Server Error",
    },
    500,
  );
};

// import { HTTPException } from 'hono/http-exception'

// export const errorHandler = async (err, c) => {
//     // Only log the message to avoid issues with circular structures or large objects
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     console.error(`[ErrorHandler]: ${errorMessage}`);

//     const isDevelopment = process.env.NODE_ENV === 'development';
//     const origin = c.req.header("Origin");

//     const addCorsHeaders = (context) => {
//         if (origin) {
//             context.header("Access-Control-Allow-Origin", origin);
//             context.header("Access-Control-Allow-Credentials", "true");
//         } else {
//             context.header("Access-Control-Allow-Origin", "*");
//         }
//         context.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//         context.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, x-conversation-id");
//     };

//     if (err instanceof HTTPException) {
//         try {
//             const resp = err.getResponse();
//             addCorsHeaders(c);
//             return resp;
//         } catch (respErr) {
//             console.error('[ErrorHandler] Failed to get response from HTTPException', respErr);
//         }
//     }

//     addCorsHeaders(c);

//     return c.json(
//         {
//             success: false,
//             message: errorMessage || 'Internal Server Error',
//             stack: isDevelopment ? err.stack : undefined,
//         },
//         500
//     );
// };
