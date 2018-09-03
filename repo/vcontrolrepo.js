const VControlTimesConverter = require('./vcontroltimesconverter')
const WeekTimerTimes = require('../models/weektimertimes')

module.exports = class VControlRepo {

  constructor(vControlClient) {
    this.vControlClient = vControlClient
  }

  async getWarmWaterHeatingTimes() {
    await this.vControlClient.connect()
    const heatingTimes = new WeekTimerTimes(
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWMo')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWDi')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWMi')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWDo')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWFr')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWSa')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerWWSo'))
    )
    await this.vControlClient.close()
    return heatingTimes
  }

  async getWarmWaterCirculationTimes() {
    await this.vControlClient.connect()
    const circulationTimes = new WeekTimerTimes(
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuMo')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuDi')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuMi')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuDo')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuFr')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuSa')),
      VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes(await this.vControlClient.getData('getTimerZirkuSo'))
    )
    await this.vControlClient.close()
    return circulationTimes
  }

  async setWarmWaterCirculationTimes(circulationTimes) {
    await this.vControlClient.connect()
    if (circulationTimes.days.monday) {
      await this.vControlClient.setData('setTimerZirkuMo',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.monday))
    }
    if (circulationTimes.days.tuesday) {
      await this.vControlClient.setData('setTimerZirkuDi',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.tuesday))
    }
    if (circulationTimes.days.wednesday) {
      await this.vControlClient.setData('setTimerZirkuMi',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.wednesday))
    }
    if (circulationTimes.days.thursday) {
      await this.vControlClient.setData('setTimerZirkuDo',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.thursday))
    }
    if (circulationTimes.days.friday) {
      await this.vControlClient.setData('setTimerZirkuFr',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.friday))
    }
    if (circulationTimes.days.saturday) {
      await this.vControlClient.setData('setTimerZirkuSa',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.saturday))
    }
    if (circulationTimes.days.sunday) {
      await this.vControlClient.setData('setTimerZirkuSo',
        VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(circulationTimes.days.sunday))
    }
    await this.vControlClient.close()
    return circulationTimes
  }

}
