import WeekCycleTimes from "../models/weekcycletimes"
import ValidationError from "../models/validationerror"
import VControlRepo from "../repo/vcontrol/vcontrolrepo"

export default class WarmWaterService {

  constructor(private repo: VControlRepo) {
  }

  async getHeatingTimes() {
    return await this.repo.getWarmWaterHeatingTimes()
  }

  async setHeatingTimes(circulationTimes: WeekCycleTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Heating times invalid")
    }
    await this.repo.setWarmWaterHeatingTimes(circulationTimes)
  }

  async getCirculationTimes() {
    return await this.repo.getWarmWaterCirculationTimes()
  }

  async setCirculationTimes(circulationTimes: WeekCycleTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Circulation times invalid")
    }
    await this.repo.setWarmWaterCirculationTimes(circulationTimes)
  }

}
