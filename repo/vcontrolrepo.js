const VControlTimes = require('./vcontroltimes')

module.exports = class VControlRepo {

  constructor(vControlClient) {
    this.vControlClient = vControlClient
  }

  async getWarmWaterHeatingTimes() {
    await this.vControlClient.connect()
    const heatingTimes = {
      monday: new VControlTimes(await this.vControlClient.getData('getTimerWWMo')).times,
      tuesday: new VControlTimes(await this.vControlClient.getData('getTimerWWDi')).times,
      wednesday: new VControlTimes(await this.vControlClient.getData('getTimerWWMi')).times,
      thursday: new VControlTimes(await this.vControlClient.getData('getTimerWWDo')).times,
      friday: new VControlTimes(await this.vControlClient.getData('getTimerWWFr')).times,
      saturday: new VControlTimes(await this.vControlClient.getData('getTimerWWSa')).times,
      sunday: new VControlTimes(await this.vControlClient.getData('getTimerWWSo')).times
    }
    await this.vControlClient.close()
    return heatingTimes
  }

  async getWarmWaterCirculationTimes() {
    await this.vControlClient.connect()
    const circulationTimes = {
      monday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuMo')).times,
      tuesday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuDi')).times,
      wednesday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuMi')).times,
      thursday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuDo')).times,
      friday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuFr')).times,
      saturday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuSa')).times,
      sunday: new VControlTimes(await this.vControlClient.getData('getTimerZirkuSo')).times
    }
    await this.vControlClient.close()
    return circulationTimes
  }

}
