import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router Object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test route
router.get("/test", requireSignIn, isAdmin, testController);

//protected user route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
  console.log("user");
});

//protected admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
  console.log("auth");
});

//alt route for both
router.get("/alt", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
  console.log("alt");
});

export default router;
