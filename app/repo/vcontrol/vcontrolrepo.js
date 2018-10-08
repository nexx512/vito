const VControlTimesConverter = require('./vcontroltimesconverter')
const WeekCycleTimes = require('../../models/weekcycletimes')

module.exports = class VControlRepo {

  constructor(vControlClient) {
    this.vControlClient = vControlClient
  }

  async getWarmWaterHeatingTimes() {
    return await this.wrapConnection(async () => {
      return new WeekCycleTimes(
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWMo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWDi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWMi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWDo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWFr')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWSa')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerWWSo'))
      )
    })
  }

  async getWarmWaterCirculationTimes() {
    return await this.wrapConnection(async () => {
      return new WeekCycleTimes(
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuMo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuDi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuMi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuDo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuFr')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuSa')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await this.vControlClient.getData('getTimerZirkuSo'))
      )
    })
  }

  async setWarmWaterCirculationTimes(circulationTimes) {
    await this.wrapConnection(async () => {
      if (circulationTimes.days.monday) {
        await this.vControlClient.setData('setTimerZirkuMo',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.monday))
      }
      if (circulationTimes.days.tuesday) {
        await this.vControlClient.setData('setTimerZirkuDi',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.tuesday))
      }
      if (circulationTimes.days.wednesday) {
        await this.vControlClient.setData('setTimerZirkuMi',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.wednesday))
      }
      if (circulationTimes.days.thursday) {
        await this.vControlClient.setData('setTimerZirkuDo',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.thursday))
      }
      if (circulationTimes.days.friday) {
        await this.vControlClient.setData('setTimerZirkuFr',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.friday))
      }
      if (circulationTimes.days.saturday) {
        await this.vControlClient.setData('setTimerZirkuSa',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.saturday))
      }
      if (circulationTimes.days.sunday) {
        await this.vControlClient.setData('setTimerZirkuSo',
          VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(circulationTimes.days.sunday))
      }
    })
  }

  async wrapConnection(callback) {
    await this.vControlClient.connect()
    try {
      let result = await callback()
      await this.vControlClient.close()
      return result
    } catch (e) {
      await this.vControlClient.close()
      throw e
    }
  }

}
