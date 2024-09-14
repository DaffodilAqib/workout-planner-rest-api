import * as _ from "lodash";
import { getWorkoutPlanOfUserInRange } from "../helper/workoutPlanHelper.js";

const getGroupedExcerciseByDateAndUserID = async (req, res) => {
  const { dateRange, userID } = req.body;
  if (!userID || _.isEmpty(dateRange))
    return res.status(400).json({
      error:
        "Bad request. Please provide missing data. Required dateRange* and userID*.",
    });
  try {
    await getWorkoutPlanOfUserInRange({
      dateRange,
      userID,
    });
  } catch (error) {
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export { getGroupedExcerciseByDateAndUserID };
