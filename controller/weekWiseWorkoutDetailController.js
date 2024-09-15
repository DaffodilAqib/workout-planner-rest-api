import * as _ from "lodash";
import {
  addWorkoutPlan,
  getWorkoutPlanOfUserInRange,
} from "../helper/workoutPlanHelper.js";

const getGroupedExcerciseByDateAndUserID = (req, res) => {
  const { startDate, endDate } = req.query;
  console.log("query > ", req.query);
  const userId = req.user.id;

  try {
    getWorkoutPlanOfUserInRange(startDate, endDate, userId).then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log("Error occured: ", err);
    res.status.send(500).json({ error: `Internal server error: ${err}` });
  }
};

const insertDefaultValue = async (req, res) => {
  console.log("working");
  const workout_plan = req.body;
  try {
    const allPromise = [];

    workout_plan.forEach((item) => {
      console.log("item", item);
      allPromise.push(addWorkoutPlan('2024-09-12', item, -1, true));
    });
    Promise.all(allPromise)
      .then((result) => {
        res.status(200).json({ suggestion: result });
      })
      .catch((err) => {
        console.log("err", err);
      });
  } catch (err) {
    console.log("Error occured: ", err);
    res.status.send(500).json({ error: `Internal server error: ${err}` });
  }
};

export { getGroupedExcerciseByDateAndUserID, insertDefaultValue };
