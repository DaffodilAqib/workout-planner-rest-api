import { insertDefaultValue } from "../controller/weekWiseWorkoutDetailController.js";
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
  console.log("data.exercises", defaultValue)

  const db = getDB();
  if (defaultValue)
    return db.func("insert_default_workout_plan", [
      date,
      'monday',
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

const addDefaultWorkoutPlan = (userId, numDays) => {
  const db = getDB();
  return db.func('create_workout_plan_based_on_default_plan', [userId, numDays])
}

export { getWorkoutPlanOfUserInRange, addWorkoutPlan, addDefaultWorkoutPlan };
