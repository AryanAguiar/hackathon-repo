import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

//load environment variables from env file
dotenv.config();

connectDB();

const app = express();

//middleware
app.use(cors()); // Allow cross-origin requests (frontend talks to the backend)
app.use(express.json()); //Parse incoming json requests
app.use(morgan("dev")); //Log HTTP requests in console

//test route
app.get("/", (req, res) => {
    res.send("API is running");
});

//routes

//user routes
app.use("/api/users", userRoutes);

//transaction routes
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

//start server
app.listen(PORT, () => {
    console.log(`Server is running one ${PORT}`);
});



