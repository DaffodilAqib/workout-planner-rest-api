import express from "express";
import OpenAI from "openai";
import { getGroupedExcerciseByDateAndUserID } from "../controller/weekWiseWorkoutDetailController.js";
const router = express.Router();

router.get("/suggestion", async (req, res, next) => {
  try {
    const { gender, age, height, weight, injury, goal } = req.body;
    const prompt = `Generate a gym workout plan with exercises tailored to a ${gender} individual, aged ${age}, with a height of ${height} ft and a weight of ${weight} kg. Please take into consideration the following injury or limitation: ${injury}. The goal is to improve ${goal}. The plan should include warm-up, main exercises, and cool-down stretches, ensuring the workout is safe given the injury.`;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SECRET_KEY, // Ensure this is set in your environment variables
    });
    // Request to OpenAI API
    const GPTOutput = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });
    const outputText = GPTOutput.choices[0].message.content;
    // Send the response back to the client
    res.status(200).json({ suggestion: outputText });
  } catch (err) {
    console.log("Error in OpenAI API call:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

router.get("/list", getGroupedExcerciseByDateAndUserID);

// Export the router with its path
export const workoutRoutes = {
  path: "/workout", // Added a leading slash to the path
  router,
};
