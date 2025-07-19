// arcjet.js
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

const isDevelopment = NODE_ENV === "development";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: isDevelopment ? [] : ["ip.src", "http.headers.user-agent"],
  rules: [
    shield({ 
      mode: isDevelopment ? "DRY_RUN" : "LIVE",
      block: isDevelopment ? [] : ["AUTOMATED", "SPAM"]
    }),
    detectBot({
      mode: isDevelopment ? "DRY_RUN" : "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        ...(isDevelopment ? ["TOOL:POSTMAN", "TOOL:THUNDER_CLIENT"] : [])
      ],
      block: isDevelopment ? [] : ["AUTOMATED"] 
    }),
    tokenBucket({
      mode: isDevelopment ? "DRY_RUN" : "LIVE",
      refillRate: isDevelopment ? 100 : 5,
      interval: 10,
      capacity: isDevelopment ? 100 : 10
    }),
  ],
});

export default aj;