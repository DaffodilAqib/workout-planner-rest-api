import express from "express";
import OpenAI from "openai";
import { addRepititionsIntoWorkoutPlan,
    getGroupedExcerciseByDateAndUserID,
    insertDefaultValue,
} from "../controller/weekWiseWorkoutDetailController.js";
import { addDefaultWorkoutPlan, addWorkoutPlan } from "../helper/workoutPlanHelper.js";
import { level, userTypes } from "../constant.js";
import { updateUser } from "../helper/userHelper.js";
import { getNextDate } from "../utils/nextDate.js";
import { getDB } from "../utils/dbConnection.js";
const router = express.Router();

router.post("/suggestion", async (req, res, next) => {
    try {
        const { gender, age, height, weight, injuries, trainingType, trainingLevel, numDays, startDate } = req.body;
        console.log("dgender, age, height, weight, injuries, trainingType, trainingLevel", gender, age, height, weight, injuries, trainingType, trainingLevel);
        const userId = req.user.id;
        // await updateUser(userId, gender, age, height, weight, trainingType, level[trainingLevel], injuries)
        const prompt = `You are a personalized gym trainer AI designed to create personalized workout plans tailored to the user's body features and preferences. Based on the following user information, generate a detailed workout plan in JSON format with structured responses and an analysis of whether the workout plan fulfills the user’s goals, along with reasons.

    User Details:
    - Age: ${age}
    - Gender: ${gender}
    - Height: ${height} in cm
    - Weight: ${weight} in kg

    - Injuries: ${injuries ?? 'None'}


    Additional Information Needed:
    - Gym experience Level: ${trainingLevel ?? 'None'}
    - User's goal : ${trainingType ?? 'None'}

    Please include the following sections in the JSON output:

    1. **workout_plan**: A JSON object for 6 days of the week with training on a single body part per day. Body parts will be Chest, Back, Bi and Tri, Shoulders and Legs. Ideally a body part should not be trained more than twice in a week and only one body part should be trained per day.
    For a particular day, there should be atleast 3 exercises per body part.

    Instructions:
    - Ensure that the workout plan aligns with the user's goal (e.g., weight loss, muscle gain).

    Format the output in JSON as follows:(Strictly follow the json format, please do not add any other information)

    {
      "workout_plan": {
        "monday": {
          "body_part": "Chest",
          "exercises": [{
            "name": "Bench Press",
            "sets": 4,
            "reps": 8,
            "body_part": "Chest",
            "description": "Focus on pushing the barbell off your chest to strengthen your chest, shoulders, and triceps."
          }
          ...
          ]
        },
        "tuesday": {
          "body_part": "Legs",
          "exercises": [
            {
        "name": "Lunges",
        "sets": 3,
        "reps": 12,
        "body_part": "Legs",
        "description": "A lower body movement that targets the quads and glutes. Alternate legs with each step."
      }
          ]
        },
        ...
      },
    }`;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_SECRET_KEY, // Ensure this is set in your environment variables
        });
        // Request to OpenAI API
        const GPTOutput = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
            response_format: { type: 'json_object' },
            max_tokens: 2000,
        });
        const outputText = GPTOutput.choices[0].message.content;

        console.log("dfdf", outputText);
        console.log("outputText", Object.values(JSON.parse(outputText))[0]);
        // res.send(outputText);
        // Send the response back to the client
        const allPromise = [];
        const dataa = JSON.parse(JSON.stringify(Object.values(JSON.parse(outputText))[0]));
        console.log("dataaa", typeof dataa);
        dataa.forEach((item, index) => {
            const date = getNextDate(startDate, index);
            allPromise.push(addWorkoutPlan(date, item, req.user.id));
        });

        Promise.all(allPromise)
            .then((result) => {
                console.log("Success:", result);
                res.status(200).json({ suggestion: result });
            })
            .catch((err) => {
                console.error("Error:", err);
                next(err); // Passes the error to the error-handling middleware
            });
    } catch (err) {
        console.log("Error in OpenAI API call:", err);
        const userId = req.user.id;
        const { numDays, startDate } = req.body;
        const db = getDB();
        const resultdf = await db.any(`SELECT 
        ROW_NUMBER() OVER(ORDER BY ex.exercise_category_id) AS row_num, --Generate row number
        array_agg(
            JSON_BUILD_OBJECT(
                'id', ex.id,
                'suggested_exercise_sets', dwp.suggested_exercise_sets,
                'suggested_exercise_reps', dwp.suggested_exercise_reps,
                'description', dwp.description
            )
        ) AS exercise_data
        FROM default_workout_plan dwp
        LEFT JOIN exercise ex ON ex.id = dwp.exercise_id
        LEFT JOIN body_parts bp ON bp.id = ex.exercise_category_id
        GROUP BY ex.exercise_category_id, bp.name
        ORDER BY ex.exercise_category_id
        LIMIT $1`, [numDays]);
        console.log("result", resultdf);
        const allPromise = []; // Array to hold all promises for parallel execution

        resultdf.forEach((item, index) => {
            console.log('star', startDate);
            const date = getNextDate(startDate, index);
            console.log('date', date);

            item.exercise_data.forEach(async (j_item) => {
                console.log("j_item", j_item);

                const insertPromise = db.any(
                    `INSERT INTO workout_plan(user_id, exercise_id, exercise_perform_date, suggested_exercise_sets, suggested_exercise_reps, description)
             VALUES($1, $2, $3, $4, $5, $6)`,
                    [userId, j_item.id, date, j_item.suggested_exercise_sets, j_item.suggested_exercise_reps, j_item.description ? j_item.description : '']
                );

                allPromise.push(insertPromise); // Push each insert into the array
            });
        });

        // Execute all the promises in parallel
        Promise.all(allPromise)
            .then((result) => {
                console.log("All inserts done");
                res.send(result);
            })
            .catch((error) => {
                console.error("Error during inserts:", error);
            });

    }
});

router.get("/list", getGroupedExcerciseByDateAndUserID);

router.post("/insert-default-value", insertDefaultValue);

router.post("./v1/suggestion", async (req, res, next) => {
    const prompt = req.body;
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_SECRET_KEY, // Ensure this is set in your environment variables
    });
    // Request to OpenAI API
    const GPTOutput = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        response_format: { type: 'json_object' },
        max_tokens: 2000,
    });
    const outputText = GPTOutput.choices[0].message.content;
    res.send(outputText);
})
router.put("/addRepetitions", addRepititionsIntoWorkoutPlan);

// Export the router with its path
export const workoutRoutes = {
    path: "/workout", // Added a leading slash to the patgoalh
    router,
    requiresAuth: true
};
