import VControlClient from "vcontrol"
import VControlRepo from "./vcontrolrepo"
import VControlTimesConverter from "./vcontroltimesconverter"
import CycleTimes from "../../../domain/models/cycletimes"
import WeekCycleTimes from "../../../domain/models/weekcycletimes"

export default class WarmWaterRepo extends VControlRepo {

  async getHeatingTimes() {
    return await this.wrapConnection(async (client) => {
      return new WeekCycleTimes(
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWMo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWDi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWMi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWDo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWFr')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWSa')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerWWSo'))
      )
    })
  }

  async setHeatingTimes(circulationTimes: WeekCycleTimes) {
    await this.wrapConnection(async (client) => {
      await this.setCycleTimesIfPresent(client, circulationTimes.days.monday, "setTimerWWMo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.tuesday, "setTimerWWDi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.wednesday, "setTimerWWMi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.thursday, "setTimerWWDo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.friday, "setTimerWWFr")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.saturday, "setTimerWWSa")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.sunday, "setTimerWWSo")
    })
  }

  async getCirculationTimes() {
    return await this.wrapConnection(async (client) => {
      return new WeekCycleTimes(
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuMo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuDi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuMi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuDo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuFr')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuSa')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerZirkuSo'))
      )
    })
  }

  async setCirculationTimes(circulationTimes: WeekCycleTimes) {
    await this.wrapConnection(async (client) => {
      await this.setCycleTimesIfPresent(client, circulationTimes.days.monday, "setTimerZirkuMo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.tuesday, "setTimerZirkuDi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.wednesday, "setTimerZirkuMi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.thursday, "setTimerZirkuDo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.friday, "setTimerZirkuFr")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.saturday, "setTimerZirkuSa")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.sunday, "setTimerZirkuSo")
    })
  }

  async setCycleTimesIfPresent(client: VControlClient, cycleTimes: CycleTimes|null, command: string) {
    if (cycleTimes) {
      await client.setData(command,
        VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(cycleTimes))
    }
  }

}
