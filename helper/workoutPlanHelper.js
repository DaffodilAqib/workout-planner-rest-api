import { getDB } from "../utils/dbConnection.js";

const getWorkoutPlanOfUserInRange = ({ startDate, endDate, userID }) => {
  const db = getDB();
  return db.func("get_workout_list_by_date_and_user", [
    startDate,
    endDate,
    userID,
  ]);
};

const addWorkoutPlan = (data, userId) => {
  const db = getDB();
  return db.func("check_and_insert_workout_plan", [
    data.date,
    data.day,
    JSON.stringify(data.exercises),
    userId,
  ]);
};

const addRepititionsDataIntoWorkoutPlan = ({
  workoutPlanId,
  startWeight,
  maxWeight,
  userPerformedSets,
  userPerformedReps,
}) => {
  const db = getDB();
  return db.func("add_repititions_into_workout_plan", [
    workoutPlanId,
    startWeight,
    maxWeight,
    userPerformedSets,
    userPerformedReps,
  ]);
};

export {
  getWorkoutPlanOfUserInRange,
  addWorkoutPlan,
  addRepititionsDataIntoWorkoutPlan,
};
