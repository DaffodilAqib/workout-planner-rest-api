const express = require("express");
const { OpenAIApi } = require('openai');

const router = express.Router();



router.get('/suggestion', async (req, res, next) => {
    try {
        const { gender, age, height, weight, injury, goal } = req.body;
        const prompt = `Generate a gym workout plan with exercises tailored to a ${gender} individual, aged ${age}, with a height of ${height} ft and a weight of ${weight} kg. Please take into consideration the following injury or limitation: ${injury}. The goal is to improve ${goal}. The plan should include warm-up, main exercises, and cool-down stretches, ensuring the workout is safe given the injury.`;

        // Set up the OpenAI configuration properly
        console.log("fdfdf", process.env.OPENAI_SECRET_KEY);
        const openai = new OpenAIApi({
            api_key: process.env.OPENAI_SECRET_KEY
        });

        // Corrected method for chat completion
        const GPTOutput = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',  // Removed spaces around the model name
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
        });

        const output_text = GPTOutput.data.choices[0].message.content;
        console.log(output_text);

        // Send the output as a response
        res.json({ message: output_text });
    } catch (err) {
        console.log("chatGpt:::::", err);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = {
    path: "/workout",  // Added a leading slash to the path
    router
};
