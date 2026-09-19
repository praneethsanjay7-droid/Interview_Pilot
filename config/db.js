const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI ||
        (process.env.DOCKER === "true" ? "mongodb://host.docker.internal:27017/interviewPilot" : "mongodb://localhost:27017/interviewPilot");

    try {
        await mongoose.connect(mongoUri);
        console.log("mongoDB connected");
    } catch (error) {
        console.log("mongodb connection failed");
        console.log(error.message);
    }
};

module.exports = connectDB;