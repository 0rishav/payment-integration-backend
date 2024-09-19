import express from "express"
import { activateUser, authenticateMe, loginUser, logoutUser, registrationUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register",registrationUser)

userRouter.post("/activate-user",activateUser)

userRouter.post("/login",loginUser)

userRouter.get("/logout",logoutUser)

userRouter.get("/me",isAuthenticated,authenticateMe)

export default userRouter