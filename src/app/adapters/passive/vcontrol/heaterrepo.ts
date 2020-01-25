import VControlClient from "vcontrol"
import VControlRepo from "./vcontrolrepo"
import VControlTimesConverter from "./vcontroltimesconverter"
import CycleTimes from "../../../domain/models/cycletimes"
import WeekCycleTimes from "../../../domain/models/weekcycletimes"

export default class HeaterRepo extends VControlRepo {

  async getHeatingTimes() {
    return await this.wrapConnection(async (client) => {
      return new WeekCycleTimes(
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerMo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerDi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerMi')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerDo')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerFr')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerSa')),
        VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes(await client.getData('getTimerSo'))
      )
    })
  }

  async setHeatingTimes(circulationTimes: WeekCycleTimes) {
    await this.wrapConnection(async (client) => {
      await this.setCycleTimesIfPresent(client, circulationTimes.days.monday, "setTimerMo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.tuesday, "setTimerDi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.wednesday, "setTimerMi")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.thursday, "setTimerDo")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.friday, "setTimerFr")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.saturday, "setTimerSa")
      await this.setCycleTimesIfPresent(client, circulationTimes.days.sunday, "setTimerSo")
    })
  }

  async setCycleTimesIfPresent(client: VControlClient, cycleTimes: CycleTimes|null, command: string) {
    if (cycleTimes) {
      await client.setData(command,
        VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(cycleTimes))
    }
  }

}
