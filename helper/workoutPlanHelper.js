import { getDB } from "../utils/dbConnection.js";

const getWorkoutPlanOfUserInRange = ({ dateRange, userID }) => {
  const db = getDB();
  return db.func("get_weekly_workout_plan", [dateRange, userID]);
};

export { getWorkoutPlanOfUserInRange };
