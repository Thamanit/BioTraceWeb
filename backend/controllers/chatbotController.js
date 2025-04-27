import axios from 'axios';

/**
 * chat w chatbot
 */
export const chatBot = async (req, res) => {
    const { query } = req.body;

    if (!query){
        res.status(400).json({ error: 'You better type something.' });
    }

    try {
        const response = await axios.post('http://localhost:8000/chat',{
            query
        })
        const botResponse = {
            response: response.data?.response
        };
    
        res.status(200).json(botResponse);
    }
    catch {
        res.status(500).json({ error: "Bang bang"})
    }
};