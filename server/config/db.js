const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" MongoDB connected");
    } catch (err) {
        console.error(` MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};



module.exports = connectDB;

