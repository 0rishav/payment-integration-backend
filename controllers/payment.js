import Razorpay from "razorpay";
import crypto from "crypto";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Payment from "../models/paymentModal.js";
import UserModel from "../models/userModal.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPayment = CatchAsyncError(async (req, res, next) => {
  const { amount, subscription_plan } = req.body;

  try {
    
    if (!subscription_plan) {
      return next(new ErrorHandler("Subscription plan is required", 400));
    }

    // Create a unique receipt with subscription_plan and timestamp
    const receipt = `receipt_${subscription_plan}_${Date.now()}`;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: receipt, // Embed subscription_plan in receipt
    };

    
    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(new ErrorHandler("Failed to create Razorpay order", 500));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


export const verifyPayment = CatchAsyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
  } = req.body;


  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler("Invalid Payment Signature", 400));
  }

  try {
   
    const order = await razorpay.orders.fetch(razorpay_order_id);

    
    const receiptParts = order.receipt.split('_');
    const subscription_plan = receiptParts[1]; 

   
    const payment = new Payment({
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentStatus: "Paid",
      user: req.user._id, 
    });

    await payment.save();

    
    await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { subscription_plan }, 
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription updated successfully",
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return next(
      new ErrorHandler("Error saving payment and updating subscription", 500)
    );
  }
});
