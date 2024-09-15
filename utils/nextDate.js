export function getNextDate(currentDate, daysToAdd) {
    currentDate = new Date(currentDate);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);
    return nextDate;
}

export function getDayOfWeek(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
}