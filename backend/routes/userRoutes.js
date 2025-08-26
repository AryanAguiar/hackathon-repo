import express from "express";
import { registerUser, loginUser, addAccount, deleteUser, getUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// /register is the path, registerUser is the controller attached to the route
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", authMiddleware, getUser);

router.post("/accounts/:id", authMiddleware, addAccount);

router.delete("/delete-user/:id", authMiddleware, deleteUser);

export default router;