import * as _ from "lodash";
import {
  addRepititionsDataIntoWorkoutPlan,
  getWorkoutPlanOfUserInRange,
} from "../helper/workoutPlanHelper.js";

const getGroupedExcerciseByDateAndUserID = async (req, res) => {
  const { startDate, endDate, userID } = req.body;
  if (!userID || _.isEmpty(dateRange))
    return res.status(400).json({
      error:
        "Bad request. Please provide missing data. Required dateRange* and userID*.",
    });
  try {
    await getWorkoutPlanOfUserInRange({
      startDate,
      endDate,
      userID,
    });
  } catch (error) {
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

const addRepititionsIntoWorkoutPlan = async (req, res) => {
  const {
    workoutPlanId,
    startWeight = 0,
    maxWeight = 0,
    userPerformedSets = 0,
    userPerformedReps = 0,
  } = req.body;
  if (!workoutPlanId)
    return res
      .status(400)
      .send(
        "Bad request. Please provide missing data. Required workoutPlanId*."
      );

  try {
    addRepititionsDataIntoWorkoutPlan({
      workoutPlanId,
      startWeight,
      maxWeight,
      userPerformedSets,
      userPerformedReps,
    }).then((result) => {
      res.send(result);
    });
  } catch (error) {
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export { getGroupedExcerciseByDateAndUserID, addRepititionsIntoWorkoutPlan };
