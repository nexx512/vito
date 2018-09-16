const WeekTimerTimes = require("../../models/weektimertimes")
const TimerTimes = require("../../models/timertimes")
const TimerTime = require("../../models/timertime")
const Time = require("../../models/time")

module.exports.toWeekTimerTimesModel = (weekTimerTimesRequestDto) => {
  let weekTimerTimes = new WeekTimerTimes()
  for (let day in weekTimerTimesRequestDto) {
    let dayTimes = new TimerTimes()
    weekTimerTimesRequestDto[day]
      .filter((time) => {
        return time.on && time.off
      })
      .forEach((time) => {
        dayTimes.add(new TimerTime(new Time(time.on), new Time(time.off)))
      })
    weekTimerTimes.set(day, dayTimes)
  }
  return weekTimerTimes
}

module.exports.toWeekTimerTimesResponseDto = (weekTimerTimesModel) => {
  let weekTimerTimesResponseDto = {}
  for (let day in weekTimerTimesModel.days) {
    weekTimerTimesResponseDto[day] = new Array(4)
    if (weekTimerTimesModel.days[day]) {
      weekTimerTimesModel.days[day].times.forEach((time, index) => {
        weekTimerTimesResponseDto[day][index] = {
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
  return weekTimerTimesResponseDto
}
