import { getDB } from "../utils/dbConnection.js";

const getWorkoutPlanOfUserInRange = (startDate, endDate, userId) => {
  const db = getDB();
  return db.func("get_workout_list_by_date_and_user", [
    startDate,
    endDate,
    userId,
  ]);
};

const addWorkoutPlan = (date, data, userId, defaultValue = false) => {
  const db = getDB();
  if (defaultValue)
    return db.func("insert_default_workout_plan", [
      date,
      "monday",
      JSON.stringify(data.exercises),
    ]);
  else {
    return db.func("check_and_insert_workout_plan", [
      data.date,
      JSON.stringify(data.exercises),
      userId,
    ]);
  }
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

const addDefaultWorkoutPlan = (userId, numDays) => {
  const db = getDB();
  return db.func("create_workout_plan_based_on_default_plan", [
    userId,
    numDays,
  ]);
};

export {
  getWorkoutPlanOfUserInRange,
  addWorkoutPlan,
  addDefaultWorkoutPlan,
  addRepititionsDataIntoWorkoutPlan,
};
