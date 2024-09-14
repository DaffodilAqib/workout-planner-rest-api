import express from "express";
import OpenAI from "openai";
import { getGroupedExcerciseByDateAndUserID } from "../controller/weekWiseWorkoutDetailController.js";
import { addWorkoutPlan } from "../helper/workoutPlanHelper.js";
const router = express.Router();

router.get("/suggestion", async (req, res, next) => {
  try {
    const { gender, age, height, weight, injuries, trainingType } = req.body;
    const prompt = `Generate a workout plan for a user with the following details:
Name: ${name}
Gender: ${gender}
Age: ${age} years
Weight: ${weight} kg
Height: ${height} cm
Injuries: ${injuries ? injuries : "None"}
Training Level: ${trainingLevel} (Beginner, Intermediate, or Advanced)
Training Type: ${trainingType} (Strength, Bulking, or Cutting)

Please provide a workout plan for a full week. Each day should have exactly 5 exercises. The response should be in an array of JSON objects where each object represents a day and date and contains 5 exercises with keys as "name" as the exercise, "sets" as the number of set of exercise, "reps" as the number of reps in one set of exercise, and a brief description and "body_part" as the body part. 
Consider any injuries when recommending exercises and tailor the intensity based on the user's training level.

Here, please note that in above context, we need 5 exercises for a particular body part for a day.`;
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
    const allPromise = [];
    data.forEach((item) => {
      allPromise.push(addWorkoutPlan(item, req.user.id));
    });

    Promise.all(allPromise)
      .then((result) => {
        console.log("Success:", result);
        res.status(200).json({ suggestion: result });
        res.send(result);
      })
      .catch((err) => {
        console.error("Error:", err);
        next(err); // Passes the error to the error-handling middleware
      });
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
  path: "/workout", // Added a leading slash to the patgoalh
  router,
};
