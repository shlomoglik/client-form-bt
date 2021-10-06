const addDays = (daysToAdd, d = new Date()) => {
    const newDate = new Date(d);
    newDate.setTime(d.getTime() + (parseInt(daysToAdd) * 24 * 3600 * 1000));
    return newDate;
}
console.log(addDays(2))
console.log(addDays(3))
console.log(addDays(-1))