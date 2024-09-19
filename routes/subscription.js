import express from 'express';
import { advanceContent, createContent, freeContent, getContent, IntermediateContent } from '../controllers/subscription.js';
import { checkSubscriptionPlan, isAuthenticated } from '../middlewares/auth.js';

const subscriptionRouter = express.Router();


subscriptionRouter.get('/free-content',isAuthenticated,checkSubscriptionPlan("Free"),freeContent);

subscriptionRouter.get('/intermediate-content', isAuthenticated, checkSubscriptionPlan('Intermediate'),IntermediateContent);

subscriptionRouter.get('/advanced-content', isAuthenticated, checkSubscriptionPlan('Advanced'),advanceContent);

subscriptionRouter.post('/create-content', isAuthenticated, createContent);

subscriptionRouter.get('/content/:type', isAuthenticated, getContent);

export default subscriptionRouter;
