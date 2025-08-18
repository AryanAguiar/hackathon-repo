import express from "express";
import { addTransactions, getTransactions, removeTransaction, syncFromBank } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
 
const router = express.Router();

router.get("/transactions-list", authMiddleware, getTransactions);

router.post("/transaction-add", authMiddleware, addTransactions);

router.post("/syncfrombank", authMiddleware, syncFromBank);

router.delete("/removeTransaction/:id", authMiddleware, removeTransaction);

export default router;