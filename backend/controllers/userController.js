import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { seedTransactionsForUser } from "../dataSeeder.js";
import Transaction from "../models/Transaction.js";
// @desc    Register new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, accounts } = req.body;

        //validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all the fields" });
        }

        //check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        //check if account id is taken
        if (accounts && accounts.length > 0) {
            for (const acc of accounts) {
                const exists = await User.findOne({ "accounts.accountId": acc.accountId });
                if (exists) return res.status(400).json({ message: `Account ID ${acc.accountId} already exists` });
            }
        }

        //create user
        const newUser = await User.create({
            name, email, password, accounts: accounts || []
        });

        // await seedTransactionsForUser(newUser);

        //generate jwt
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            accounts: newUser.accounts,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        //find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //generate jwt
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accounts: user.accounts,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc get user
export const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

//@desc add account
// export const addAccount = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { accountId, bankName, accountType, balance } = req.body;

//         if (!accountId || !bankName) {
//             return res.status(400).json({ message: "accountId and bankName are required" });
//         }


//         // find user
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // push new account
//         const newAccount = {
//             accountId,
//             bankName,
//             accountType,
//             balance: balance || 0
//         };
//         user.accounts.push(newAccount);

//         await user.save();
//         await seedTransactionsForUser(user, newAccount.accountId);

//         res.status(201).json({ message: "Account added successfully", accounts: user.accounts });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

export const addAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { bankName, mobile, accountType } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        //generate random account no
        const accountId = Math.floor(100000000 + Math.random() * 9000000000).toString();

        //generate random balance
        const balance = Math.floor(Math.random() * (100000 - 10000) + 10000)

        //generate random IFSC number
        const ifsc = bankName.slice(0, 4).toUpperCase() + Math.floor(1 + Math.random() * 9999999).toString();

        //push to account
        const newAccount = {
            bankName,
            accountId, //accountNo same thing
            ifsc,
            balance,
            accountType,
            mobile
        }
        user.accounts.push(newAccount);
        await user.save();
        await seedTransactionsForUser(user, newAccount.accountId);

        res.status(201).json({ message: "Account added successfully", accounts: user.accounts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//@desc delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        //find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //delete transactions
        await Transaction.deleteMany({ user: userId });

        //delete user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User and all linked transactions deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}