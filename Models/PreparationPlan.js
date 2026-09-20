const mongoose = require("mongoose");

const preparationPlanSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    company: {
        type: String,
        required: true
    },

    generatedDate: {
        type: Date,
        default: Date.now
    },

    plan: {
        type: String,
        required: true
    }
});

const PreparationPlan = mongoose.model(
    "PreparationPlan",
    preparationPlanSchema
);

module.exports = PreparationPlan;
