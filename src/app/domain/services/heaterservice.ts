import WeekCycleTimes from "../models/weekcycletimes"
import ValidationError from "../models/validationerror"
import HeaterRepo from "../../adapters/passive/vcontrol/heaterrepo"

export default class WarmWaterService {

  constructor(private repo: HeaterRepo) {
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

}
