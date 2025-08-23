// demoSeeder.js
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import Transaction from "./models/Transaction.js";
import { categoriseTransactions } from "./utils/categoriseTransactions.js";

const templateTransactions = JSON.parse(fs.readFileSync("./demoTransactions.json", "utf-8"));

export async function seedTransactionsForUser(user) {
    try {
        for (const account of user.accounts) {
            const count = await Transaction.countDocuments({ user: user._id, accountId: account.accountId });
            if (count > 0) continue; 

            const transactionsToInsert = [];
            for (let i = 0; i < 50; i++) {
                const template = templateTransactions[i % templateTransactions.length];
                const category = categoriseTransactions(template.description, template.type);

                transactionsToInsert.push({
                    ...template,
                    category,
                    transactionId: uuidv4(),
                    user: user._id,
                    accountId: account.accountId,
                    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            await Transaction.insertMany(transactionsToInsert);
            console.log(`Inserted 50 transactions for user ${user.name}, account ${account.accountId}`);
        }
    } catch (err) {
        console.error(err);
    }
}
