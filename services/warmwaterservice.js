const TimerTimes = require("../models/timertimes")


module.exports = class WarmWaterService {
  constructor(repo) {
    this.repo = repo
  }

  async getHeatingTimes() {
    return await this.repo.getWarmWaterHeatingTimes()
  }

  async getCirculationTimes() {
    return await this.repo.getWarmWaterCirculationTimes()
  }

  async setCirculationTimes(circulationTimes) {
    if (!circulationTimes.validate()) {
      throw new Error("circulation times invalid")
    }
    await this.repo.setWarmWaterCirculationTimes(circulationTimes)
  }

}
