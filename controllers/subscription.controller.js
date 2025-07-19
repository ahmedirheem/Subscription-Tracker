import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user.id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscription,
        workflowRunId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      // const error = new Error("You are not the owner of this account");
      // error.statusCode = 401;
      // throw error;

      throw new ApiError(401, "You are not the owner of this account");
    }

    const subscriptions = await Subscription.find({
      user: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      // const error = new Error("Subscription not found");
      // error.statusCode = 404;
      // throw error;

      throw new ApiError(404, "Subscription not found");
    }

    res.status(200).json({
      success: true,
      data: {
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subscription = await Subscription.findById(req.params.id).session(
      session
    );

    if (!subscription) {
      // const error = new Error("Subscription not found");
      // error.statusCode = 404;
      // throw error;

      throw new ApiError(404, "Subscription not found");
    }

    if (subscription.user.toString() !== req.user.id) {
      // const error = new Error("Unauthorized: Not your subscription");
      // error.statusCode = 403;
      // throw error;

      throw new ApiError(403, "Unauthorized: Not your subscription");
    }

    await Subscription.deleteOne({ _id: req.params.id }).session(session);

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: {
        subscription,
      },
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subscription = await Subscription.findById(req.params.id).session(
      session
    );

    if (!subscription) {
      // const error = new Error("Subscription not found");
      // error.statusCode = 404;
      // throw error;

      throw new ApiError(404, "Subscription not found");
    }

    if (subscription.user.toString() !== req.user.id) {
      // const error = new Error("Unauthorized: Not your subscription");
      // error.statusCode = 403;
      // throw error;

      throw new ApiError(403, "Unauthorized: Not your subscription");
    }

    const {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      status,
      startDate,
      renewalDate,
    } = req.body;

    const updatedFields = {
      ...(name && { name }),
      ...(price && { price }),
      ...(currency && { currency }),
      ...(frequency && { frequency }),
      ...(category && { category }),
      ...(paymentMethod && { paymentMethod }),
      ...(status && { status }),
      ...(startDate && { startDate }),
      ...(renewalDate && { renewalDate }),
      updatedAt: new Date(),
    };

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true, session }
    ).session(session);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: {
        subscription: updated,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
