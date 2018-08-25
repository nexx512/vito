const VControlTimes = require('./vcontroltimes')

module.exports = class VControlRepo {

  constructor(vcontrolClient) {
    this.vcontrolClient = vcontrolClient
  }

  async getWarmWaterTimes() {
    await this.vcontrolClient.connect()
    const heatingTimes = {
      monday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWMo')).times,
      tuesday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWDi')).times,
      wednesday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWMi')).times,
      thursday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWDo')).times,
      friday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWFr')).times,
      saturday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWSa')).times,
      sunday: new VControlTimes(await this.vcontrolClient.getData('getTimerWWSo')).times
    }
    await this.vcontrolClient.close()
    return heatingTimes
  }

}
