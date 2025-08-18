import express from "express";
import { registerUser, loginUser, addAccount } from "../controllers/userController.js";

const router = express.Router();

// /register is the path, registerUser is the controller attached to the route
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/:id/accounts", addAccount);

export default router;