// routes/chat.js

import {chatWithOpenRouter} from "../services/deepseekSetup.js";



const DeepseekChatbot = async (req, res) => {
  const { message } = req.body;

  try {
    const reply = await chatWithOpenRouter(message);
    console.log(reply);
    res.json({ response: reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error communicating with DeepSeek API" });
  }
};

export { DeepseekChatbot } ;
