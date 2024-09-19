import { updateAccessToken } from "../controllers/user.js";
import UserModel from "../models/userModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
 
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Please Login to access this resource", 400));
  }

  const decoded = jwt.decode(access_token);

  if (!decoded) {
    return next(new ErrorHandler("Access token is not valid", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Please Login to access this resource", 400));
    }

    req.user = user;
    next();
  }
});

export const checkSubscriptionPlan = (requiredPlan) => {
  return CatchAsyncError(async (req, res, next) => {
      if (!req.user) {
          return next(new ErrorHandler("Authentication required", 401));
      }

      const userPlan = req.user.subscription_plan;

      if (userPlan === requiredPlan || (userPlan === "Advanced" && requiredPlan !== "Free")) {
          next();
      } else {
          return next(new ErrorHandler("Access Denied: Insufficient plan", 403));
      }
  });
};