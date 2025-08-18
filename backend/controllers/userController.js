import User from "../models/User.js";
import jwt from "jsonwebtoken";

// @desc    Register new user
// @route   POST /api/users/register
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

        //create user
        const newUser = await User.create({
            name, email, password, accounts: accounts || []
        });

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
//@route POST/ /api/users/login
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

//add account
export const addAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountId, bankName, accountType, balance } = req.body;

        if (!accountId || !bankName) {
            return res.status(400).json({ message: "accountId and bankName are required" });
        }


        // find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // push new account
        const newAccount = {
            accountId,
            bankName,
            accountType,
            balance: balance || 0
        };
        user.accounts.push(newAccount);

        await user.save();

        res.status(201).json({ message: "Account added successfully", accounts: user.accounts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}