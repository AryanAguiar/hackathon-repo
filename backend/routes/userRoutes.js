import express from "express";
import { registerUser, loginUser, addAccount, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// /register is the path, registerUser is the controller attached to the route
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/:id/accounts", addAccount);

router.delete("/:id/delete-user", deleteUser);

export default router;