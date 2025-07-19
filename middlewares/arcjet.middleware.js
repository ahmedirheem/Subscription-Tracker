// arcjet.middleware.js
import aj from "../config/arcjet.js";
import { NODE_ENV } from "../config/env.js";

const arcjetMiddleware = async (req, res, next) => {
  if (NODE_ENV === "development" && !process.env.ARCJET_KEY) {
    console.log("Arcjet bypassed in development (no key)");
    return next();
  }

  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ 
          error: "Rate limit exceeded",
          details: decision.reason
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ 
          error: "Bot detected",
          details: {
            ...decision.reason,
            currentUserAgent: req.headers["user-agent"]
          }
        });
      }

      return res.status(403).json({ 
        error: "Access denied",
        details: decision.reason
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet Processing Error:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    next(error);
  }
};

export default arcjetMiddleware;