const WeekCycleTimes = require("../../app/models/weekcycletimes")
const CycleTimes = require("../../app/models/cycletimes")
const CycleTime = require("../../app/models/cycletime")
const Time = require("../../app/models/time")

module.exports.toWeekCycleTimesModel = (weekCycleTimesRequestDto) => {
  let weekCycleTimes = new WeekCycleTimes()
  for (let day in weekCycleTimesRequestDto) {
    let dayTimes = new CycleTimes()
    weekCycleTimesRequestDto[day]
      .filter((time) => {
        return time.on && time.off
      })
      .forEach((time) => {
        dayTimes.add(new CycleTime(new Time(time.on), new Time(time.off)))
      })
    weekCycleTimes.set(day, dayTimes)
  }
  return weekCycleTimes
}

module.exports.toWeekCycleTimesResponseDto = (weekCycleTimesModel) => {
  let weekCycleTimesResponseDto = {}
  for (let day in weekCycleTimesModel.days) {
    weekCycleTimesResponseDto[day] = new Array(4)
    if (weekCycleTimesModel.days[day]) {
      weekCycleTimesModel.days[day].times.forEach((time, index) => {
        weekCycleTimesResponseDto[day][index] = {
          on: {
            time: time.on.time,
            errors: time.on.errors.items.map((e) => e.message)
          },
          off: {
            time: time.off.time,
            errors: time.off.errors.items.map((e) => e.message)
          }
        }
      })
    }
  }
  return weekCycleTimesResponseDto
}
