import Razorpay from "razorpay";
import crypto from "crypto";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Payment from "../models/paymentModal.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

export const createPayment = CatchAsyncError(async (req, res, next) => {
  const { amount, name, email } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(new ErrorHandler("Failed to create Razorpay order", 500));
    }

    res.status(200).json({
      success: true,
      order,
      name,
      email,
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
    name,
    email,
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
    const payment = new Payment({
      name,
      email,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentStatus: "Paid",
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment done successfully",
    });
  } catch (error) {
    console.error('Error saving payment:', error.message); 
    return next(new ErrorHandler("Error saving payment to the database", 500));
  }
});

