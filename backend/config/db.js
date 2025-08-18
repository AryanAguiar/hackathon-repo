import mongoose from "mongoose";

const connectDB = async () => {
    try{
        // `mongoose.connect` tries to open a connection to MongoDB
        //process.env.MONGO_URI comes from the env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Makes connection parsing more robust
            useUnifiedTopology: true, // Uses the newer connection engine (fewer bugs)
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Errro: ${error.message}`);
        process.exit(1); //exit process withour crashing entire app
    }
};

export default connectDB;