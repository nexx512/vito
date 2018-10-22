import WeekCycleTimes,{WeekCycleTimesTypes} from "../../app/models/weekcycletimes"
import CycleTimes from "../../app/models/cycletimes"
import CycleTime from "../../app/models/cycletime"
import Time from "../../app/models/time"

type WeekCycleTimesRequestDto = {
  [index: string]: [{
    on: string,
    off: string
  }]
}

type WeekCycleTimesResponseDto = {
  [index: string]: [{
    on: {
      time: string|null,
      errors: string[]
    },
    off: {
      time: string|null,
      errors: string[]
    }
  }?]
}

export default class WeekCycleTimesConverter {

  static toWeekCycleTimesModel(weekCycleTimesRequestDto: WeekCycleTimesRequestDto) {
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
      weekCycleTimes.set(<WeekCycleTimesTypes.Days>day, dayTimes)
    }
    return weekCycleTimes
  }

  static toWeekCycleTimesResponseDto(weekCycleTimesModel: WeekCycleTimes) {
    let weekCycleTimesResponseDto: WeekCycleTimesResponseDto = {}
    for (let day in weekCycleTimesModel.days) {
      weekCycleTimesResponseDto[day] = []
      let dayTimes = weekCycleTimesModel.days[<WeekCycleTimesTypes.Days>day]
      if (dayTimes) {
        dayTimes.times.forEach((time, index) => {
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

}
