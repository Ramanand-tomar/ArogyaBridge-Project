import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ChatBot = async (req, res) => {
  const { message } = req.body;
  console.log("body is " ,req.body)
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
      systemInstruction: {
        parts: [
          {
            text:
              "You are ArogyaBridge, a Decentralized Medical Records system using blockchain. " +
              "Your conversation with users is all about healthcare, prescription suggestions, and health habits. " +
              "Talk with patients politely in a funny tone. Enjoy the conversation with some jokes. " +
              "If a user gives a message unrelated to health, respond rudely but humorously." +
              "give answer in short and sweet manner in easy language but impactfull and alway start talk with hey I am ArogyBridge Your Healthcare Assitent" +
              " understand user by taking example like real life and talk with hinglish language ",
          },
        ],
        role: "system",
      },
    });
    const result = await chat.sendMessage(message);

    const replyText = await result.response.text();
    

    // FIX: Send reply as JSON
    res.json({ reply: replyText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, I couldn't process your request." });
  }
}

export { ChatBot };