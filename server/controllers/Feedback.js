import { Feedback } from "../models/FeedbackSchema.js";

const createFeedback = async (req, res) => {
  try {
    const { email, message } = req.body;
    console.log("Received feedback:", req.body);
    const feedback = new Feedback({ email, feedback : message });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

const FeedbackGet =  async(req , res) => {
    try {
        const feedback = await Feedback.find({});
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

export  { createFeedback, FeedbackGet };
