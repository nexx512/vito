const CycleTimes = require("../models/cycletimes")
const ValidationError = require("../models/validationerror")

module.exports = class WarmWaterService {
  constructor(repo) {
    this.repo = repo
  }

  async getHeatingTimes() {
    return await this.repo.getWarmWaterHeatingTimes()
  }

  async setHeatingTimes(circulationTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Heating times invalid")
    }
    await this.repo.setWarmWaterHeatingTimes(circulationTimes)
  }

  async getCirculationTimes() {
    return await this.repo.getWarmWaterCirculationTimes()
  }

  async setCirculationTimes(circulationTimes) {
    if (!circulationTimes.validate()) {
      throw new ValidationError("Circulation times invalid")
    }
    await this.repo.setWarmWaterCirculationTimes(circulationTimes)
  }

}
