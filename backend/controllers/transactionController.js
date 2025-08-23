import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { syncTransactions } from "../utils/syncTransactions.js";

//@desc get all transactions for logged in user
export const getTransactions = async (req, res) => {
    try {
        const { range, start, end } = req.query;
        const today = new Date();
        let startDate = null;
        let endDate = today;

        if (range) {
            switch (range) {
                case "weekly":
                    startDate = new Date();
                    startDate.setDate(today.getDate() - 7);
                    break;
                case "monthly":
                    startDate = new Date();
                    startDate.setMonth(today.getMonth() - 1);
                    break;
                case "quarterly":
                    startDate = new Date();
                    startDate.setMonth(today.getMonth() - 3);
                    break;
                default:
                    break;
            }
        } else if (start && end) {
            startDate = new Date(start);
            endDate = new Date(end);
        }

        let dateMatch = {};
        if (startDate) {
            dateMatch = { date: { $gte: startDate, $lte: endDate } };
        }

        //find all transactions
        const transactions = await Transaction.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(req.user._id), ...dateMatch } //onl gets data from logged in user
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            { $unwind: "$userData" },
            {
                $addFields: {
                    account: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$userData.accounts",
                                    as: "acc",
                                    cond: { $eq: ["$$acc.accountId", "$accountId"] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            { $project: { userData: 0 } }, // remove extra user data
            { $sort: { date: -1 } }
        ])
        // const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc add one transaction for testing
export const addTransactions = async (req, res) => {
    try {
        const { accountId, transactionId, type, category, amount, description, date } = req.body;

        const newTxn = await syncTransactions(
            { accountId, transactionId, type, category, amount, description, date },
            req.user._id
        );

        if (!newTxn) {
            return res.status(400).json({ message: "Transaction already exists" });
        }

        res.status(201).json(newTxn);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc remove transaction for testing
export const removeTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.user._id;

        const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        await transaction.deleteOne();

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction: ", error);
        res.status(500).json({ message: "Server error" });
    }
};

//@desc syncs mutiple transactions from bank api
export const syncFromBank = async (req, res) => {
    try {
        //an array of transactions
        const transactions = req.body.transactions || req.body;
        const userId = req.user._id;

        if (!Array.isArray(transactions)) {
            return res.status(400).json({ message: "Transactions must be an array" });
        }

        let synced = [];
        for (const txn of transactions) {
            const newTxn = await syncTransactions(txn, userId);
            if (newTxn) synced.push(newTxn);
        }

        res.status(200).json({
            message: "Transactions synced successfully",
            syncedCount: synced.length,
            transactions: synced
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};