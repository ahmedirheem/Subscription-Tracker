import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, deleteSubscription, getSubscription, getSubscriptions, getUserSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getSubscriptions);

subscriptionRouter.get("/:id", getSubscription);


subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({ title: "CANCEL a subscription" })
);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ title: "GET upcoming renewals subscription" })
);

export default subscriptionRouter;
