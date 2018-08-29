const Errors = require("../models/errors")
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
    let errors = circulationTimes.validate()
    if (errors.hasErrors()) throw errors
    await this.repo.setWarmWaterCirculationTimes(circulationTimes)
  }

}
