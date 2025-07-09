import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
export const Feedback = mongoose.model('Feedback', feedbackSchema);