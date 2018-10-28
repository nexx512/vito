import VControlClient from "./vcontrolclient"
import VControlTimesConverter from "./vcontroltimesconverter"
import CycleTimes from "../../models/cycletimes"
import WeekCycleTimes from "../../models/weekcycletimes"

export default class VControlRepo {

  constructor(public vControlClient: VControlClient) {
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

  async setWarmWaterHeatingTimes(circulationTimes: WeekCycleTimes) {
    await this.wrapConnection(async () => {
      await this.setCycleTimesIfPresent(circulationTimes.days.monday, "setTimerWWMo")
      await this.setCycleTimesIfPresent(circulationTimes.days.tuesday, "setTimerWWDi")
      await this.setCycleTimesIfPresent(circulationTimes.days.wednesday, "setTimerWWMi")
      await this.setCycleTimesIfPresent(circulationTimes.days.thursday, "setTimerWWDo")
      await this.setCycleTimesIfPresent(circulationTimes.days.friday, "setTimerWWFr")
      await this.setCycleTimesIfPresent(circulationTimes.days.saturday, "setTimerWWSa")
      await this.setCycleTimesIfPresent(circulationTimes.days.sunday, "setTimerWWSo")
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

  async setWarmWaterCirculationTimes(circulationTimes: WeekCycleTimes) {
    await this.wrapConnection(async () => {
      await this.setCycleTimesIfPresent(circulationTimes.days.monday, "setTimerZirkuMo")
      await this.setCycleTimesIfPresent(circulationTimes.days.tuesday, "setTimerZirkuDi")
      await this.setCycleTimesIfPresent(circulationTimes.days.wednesday, "setTimerZirkuMi")
      await this.setCycleTimesIfPresent(circulationTimes.days.thursday, "setTimerZirkuDo")
      await this.setCycleTimesIfPresent(circulationTimes.days.friday, "setTimerZirkuFr")
      await this.setCycleTimesIfPresent(circulationTimes.days.saturday, "setTimerZirkuSa")
      await this.setCycleTimesIfPresent(circulationTimes.days.sunday, "setTimerZirkuSo")
    })
  }

  async setCycleTimesIfPresent(cycleTimes: CycleTimes|null, command: string) {
    if (cycleTimes) {
      await this.vControlClient.setData(command,
        VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(cycleTimes))
    }
  }

  async wrapConnection(callback: any) {
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
