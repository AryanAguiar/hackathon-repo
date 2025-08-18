// demoSeeder.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";

dotenv.config();

// Load your template transactions
const templateTransactions = JSON.parse(fs.readFileSync("./demoTransactions.json", "utf-8"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;  
await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function seedTransactions() {
    try {
        const users = await User.find({}).lean();

        for (const user of users) {
            for (const account of user.accounts) {
                const transactionsToInsert = [];

                // Generate 50 transactions per account
                for (let i = 0; i < 50; i++) {
                    const template = templateTransactions[i % templateTransactions.length]; // loop over template

                    transactionsToInsert.push({
                        ...template,
                        transactionId: uuidv4(),
                        user: user._id,
                        accountId: account.accountId,
                        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // random date in last 30 days
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }

                const count = await Transaction.countDocuments({ user: user._id, accountId: account.accountId });
                if (count === 0) {
                    await Transaction.insertMany(transactionsToInsert);
                    console.log(`Inserted 50 transactions for user ${user.name}, account ${account.accountId}`);
                } else {
                    console.log(`Skipped user ${user.name}, account ${account.accountId} (transactions already exist)`);
                }
            }
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedTransactions();
