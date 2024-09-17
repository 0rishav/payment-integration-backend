import express from "express"
import { createPayment, verifyPayment } from "../controllers/payment.js";
import { isAuthenticated } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment",isAuthenticated,createPayment);

paymentRouter.post("/verify-payment",isAuthenticated,verifyPayment);

export default paymentRouter