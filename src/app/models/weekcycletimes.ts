import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import CycleTimes from "./cycletimes"

export module WeekCycleTimesTypes {
  export enum Days {
    MONDAY = "monday",
    TUESDAY= "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
  }

export type CycleTimeDays = {
    [index in Days]: CycleTimes | null;
};

}

export default class WeekCycleTimes implements Validatable {

  days: WeekCycleTimesTypes.CycleTimeDays
  errors: ValidationErrors

  constructor(
      monday: CycleTimes|null = null,
      tuesday: CycleTimes|null = null,
      wednesday: CycleTimes|null = null,
      thursday: CycleTimes|null = null,
      friday: CycleTimes|null = null,
      saturday: CycleTimes|null = null,
      sunday: CycleTimes|null = null) {
    this.days = {
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday
    }
    this.errors = new ValidationErrors()
  }

  set(day: WeekCycleTimesTypes.Days, times: CycleTimes) {
    this.days[day] = times
  }

  validate() {
    return (<WeekCycleTimesTypes.Days[]>Object.keys(this.days))
      .reduce((isValid, day) => {let dayTimes = this.days[day]; return dayTimes ? dayTimes.validate() && isValid : isValid}, true)
  }

}
