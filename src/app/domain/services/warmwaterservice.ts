import WeekCycleTimes from "../models/weekcycletimes"
import ValidationError from "../models/validationerror"
import WarmWaterRepo from "../../adapters/passive/vcontrol/warmwaterrepo"

export default class WarmWaterService {

  constructor(private repo: WarmWaterRepo) {
  }

  async getHeatingTimes() {
    return await this.repo.getHeatingTimes()
  }

  async setHeatingTimes(circulationTimes: WeekCycleTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Heating times invalid")
    }
    await this.repo.setHeatingTimes(circulationTimes)
  }

  async getCirculationTimes() {
    return await this.repo.getCirculationTimes()
  }

  async setCirculationTimes(circulationTimes: WeekCycleTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Circulation times invalid")
    }
    await this.repo.setCirculationTimes(circulationTimes)
  }

}
