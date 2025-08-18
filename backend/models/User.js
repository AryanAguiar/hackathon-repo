import mongoose from "mongoose";
import bcrypt from "bcryptjs";


//create schema definition -> defines the structure of the user in the mongodb docs 
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        accounts: [
            {
                accountId: { type: String, required: true }, // e.g. "acc_123"
                bankName: { type: String },                  // optional - "Chase", "HDFC"
                accountType: { type: String, enum: ["checking", "savings", "credit"], default: "checking" },
                balance: { type: Number, default: 0 },       // you can keep this in sync from transactions
                createdAt: { type: Date, default: Date.now }
            }
        ],

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

//hashes the password before it is saved
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//compares the entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//exports the model
const User = mongoose.model("User", userSchema);
export default User;

