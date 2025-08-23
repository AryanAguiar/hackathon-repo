// demoSeeder.js
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import Transaction from "./models/Transaction.js";
import { categoriseTransactions } from "./utils/categoriseTransactions.js";
import User from "./models/User.js";

const templateTransactions = JSON.parse(fs.readFileSync("./demoTransactions.json", "utf-8"));

function randomDateBetween(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getSalaryDates(monthsBack = 3) {
    const dates = [];
    const now = new Date();

    for (let i = 0; i < monthsBack; i++) {
        // Salary on 1st at 10 AM
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1, 10, 0, 0);
        dates.push(d);
    }

    return dates;
}

// Recurring fixed expenses each month
const recurringExpenses = [
    { day: 5, description: "Monthly Rent", amount: 12000 },
    { day: 7, description: "Car Loan EMI", amount: 8000 },
    { day: 15, description: "Health Insurance Premium", amount: 3000 },
    { day: 20, description: "Netflix Subscription", amount: 499 },
];

export async function seedTransactionsForUser(user, startingBalance) {
    try {
        for (const account of user.accounts) {
            const count = await Transaction.countDocuments({ user: user._id, accountId: account.accountId });
            if (count > 0) continue;

            let balance = account.balance || startingBalance;
            let transactionsToInsert = [];

            // --- Step 1. Salary credits ---
            const salaryAmount = Math.floor(30000 + Math.random() * 20000); // 30k–50k
            const salaryDates = getSalaryDates(3);

            salaryDates.forEach(date => {
                balance += salaryAmount;
                transactionsToInsert.push({
                    transactionId: uuidv4(),
                    type: "CREDIT",
                    description: "Monthly Salary",
                    amount: salaryAmount,
                    category: "Income",
                    user: user._id,
                    accountId: account.accountId,
                    date,
                    balanceAfter: balance
                });
            });

            // --- Step 2. Recurring fixed expenses ---
            salaryDates.forEach(date => {
                const year = date.getFullYear();
                const month = date.getMonth();

                recurringExpenses.forEach(exp => {
                    const expDate = new Date(year, month, exp.day, 12, 0, 0);
                    balance -= exp.amount;
                    transactionsToInsert.push({
                        transactionId: uuidv4(),
                        type: "DEBIT",
                        description: exp.description,
                        amount: exp.amount,
                        category: "Bills & Utilities",
                        user: user._id,
                        accountId: account.accountId,
                        date: expDate,
                        balanceAfter: balance
                    });
                });
            });

            // --- Step 3. Random daily transactions between salaries ---
            for (let i = 0; i < salaryDates.length; i++) {
                const start = salaryDates[i];
                const end = i === 0 ? new Date() : salaryDates[i - 1];

                for (let j = 0; j < 8; j++) { // ~8 random transactions per month
                    const template = templateTransactions[Math.floor(Math.random() * templateTransactions.length)];
                    const category = categoriseTransactions(template.description, template.type);
                    const date = randomDateBetween(start, end);

                    if (template.type.toUpperCase() === "CREDIT") {
                        balance += template.amount;
                    } else {
                        balance -= template.amount;
                    }

                    transactionsToInsert.push({
                        ...template,
                        category,
                        transactionId: uuidv4(),
                        user: user._id,
                        accountId: account.accountId,
                        date,
                        balanceAfter: balance
                    });
                }
            }

            // --- Step 4. Sort chronologically & insert ---
            transactionsToInsert.sort((a, b) => a.date - b.date);

            await User.updateOne(
                { _id: user._id, "accounts.accountId": account.accountId },
                { $set: { "accounts.$.balance": balance } }
            );

            await Transaction.insertMany(transactionsToInsert);
            console.log(`Inserted ${transactionsToInsert.length} transactions for user ${user.name}, account ${account.accountId}`);
        }
    } catch (err) {
        console.error(err);
    }
}
