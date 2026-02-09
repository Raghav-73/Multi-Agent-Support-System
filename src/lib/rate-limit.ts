const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export interface RateLimitOptions {
    windowMs: number;
    max: number;
}

export function rateLimit(ip: string, options: RateLimitOptions) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > options.windowMs) {
        record.count = 0;
        record.lastReset = now;
    }

    if (record.count >= options.max) {
        return {
            success: false,
            remaining: 0,
            reset: record.lastReset + options.windowMs
        };
    }

    record.count++;
    rateLimitMap.set(ip, record);

    return {
        success: true,
        remaining: options.max - record.count,
        reset: record.lastReset + options.windowMs
    };
}
