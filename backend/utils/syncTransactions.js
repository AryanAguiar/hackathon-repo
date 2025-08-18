import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const syncTransactions = async (transactionData, userId) => {
  try {
    //ensure transactionId exists
    if (!transactionData.transactionId) {
      console.error("Transaction missing transactionId:", transactionData);
      return null;
    }

    //check if transaction already exists (scoped per user)
    const existingTxn = await Transaction.findOne({
      transactionId: transactionData.transactionId,
      user: userId
    });

    if (existingTxn) {
      return "DUPLICATE"; // clearly mark duplicate
    }

    //save new transaction
    const newTxn = await Transaction.create({
      ...transactionData,
      user: userId,
    });

    //update account balance
    const user = await User.findById(userId);

    if (user) {
      const account = user.accounts.find(
        (acc) => acc.accountId === transactionData.accountId
      );

      if (account) {
        switch (transactionData.type) {
          case "income":
            account.balance += transactionData.amount;
            break;
          case "expense":
            account.balance -= transactionData.amount;
            break;
          // you can extend this for transfers, loans, etc.
        }

        await user.save();
      }
    }

    return newTxn;
  } catch (error) {
    console.error("Error syncing transaction:", error);
    throw error; // let controller handle response
  }
};
