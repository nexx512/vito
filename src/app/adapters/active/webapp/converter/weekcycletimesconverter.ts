import WeekCycleTimes,{WeekCycleTimesTypes} from "../../../../domain/models/weekcycletimes"
import CycleTimes from "../../../../domain/models/cycletimes"
import CycleTime from "../../../../domain/models/cycletime"
import Time from "../../../../domain/models/time"

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

        // fill missing times to always have at least 4 timeslots
        for (let i = dayTimes.times.length; i < 4; ++i) {
          weekCycleTimesResponseDto[day][i] = {
            on: {
              time: null,
              errors: []
            },
            off: {
              time: null,
              errors: []
            }
          }
        }
      }
    }
    return weekCycleTimesResponseDto
  }

}
