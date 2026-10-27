import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini client with API key
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const SYSTEM_INSTRUCTION = `You are ArogyaBridge AI, an intelligent, empathetic, and professional healthcare assistant for the ArogyaBridge Decentralized Health Record platform.

Key Guidelines:
1. Role & Identity: You assist patients, doctors, and diagnostic centers with understanding general healthcare concepts, wellness habits, preventive care, medical terminology, and how to manage their digital health records.
2. Clinical Safety Disclaimer: ALWAYS remind the user whenever discussing medical symptoms or conditions:
   "⚠️ Disclaimer: I am an AI healthcare assistant and not a medical doctor. This information is for educational purposes only. Please consult a qualified healthcare professional for medical diagnosis and treatment."
3. Emergencies: If the user describes emergency symptoms (e.g., chest pain, difficulty breathing, sudden numbness, severe trauma, poisoning), immediately tell them to contact local emergency medical services (such as 108/911/112) or visit the nearest emergency room.
4. Prescriptions: Do NOT fabricate or prescribe specific prescription-only medications or specific drug dosages. Direct the user to their consulting doctor.
5. Tone: Polite, compassionate, respectful, clear, and reassuring. Respond in simple, easy-to-understand language. If the user writes in Hinglish or Hindi, respond naturally in helpful, polite Hinglish.`;

const ChatBot = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A valid message string is required.' });
  }

  if (!genAI) {
    return res.status(500).json({
      reply: 'AI service is currently not configured with an API key. Please check server environment settings.',
    });
  }

  try {
    // gemini-1.5-flash or gemini-2.0-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const replyText = await result.response.text();

    return res.status(200).json({ reply: replyText });
  } catch (err) {
    console.error('Gemini ChatBot Error:', err.message);
    return res.status(500).json({
      reply: "I apologize, but I am having trouble connecting right now. Please consult a healthcare professional for urgent medical queries.",
    });
  }
};

export { ChatBot };