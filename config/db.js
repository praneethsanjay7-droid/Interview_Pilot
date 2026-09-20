const mongoose = require("mongoose");

// Prevent process exit from unhandled EventEmitter error on Mongoose connection
mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error event:", err.message);
});

const connectDB = async () => {
    if (!process.env.MONGO_URI && process.env.NODE_ENV === "production") {
        console.warn("WARNING: MONGO_URI environment variable is missing. Database operations will be skipped.");
        return;
    }

    const mongoUri = process.env.MONGO_URI ||
        (process.env.DOCKER === "true" ? "mongodb://host.docker.internal:27017/interviewPilot" : "mongodb://localhost:27017/interviewPilot");

    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log("mongoDB connected");
    } catch (error) {
        console.log("mongodb connection failed:", error.message);
    }
};

module.exports = connectDB;