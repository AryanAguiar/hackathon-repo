import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        accountId: {
            type: String,
            required: true,
        },

        // Transaction ID from RBI / simulated API
        transactionId: {
            type: String,
            required: true,
            unique: true, 
        },

        type: {
            type: String,
            enum: ["CREDIT", "DEBIT"],
            required: true,
        },

        category: {
            type: String,
            default: "general",
        },

        amount: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            trim: true,
        },

        balanceAfter: { type: Number },

        date: {
            type: Date,
            required: true,  
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
