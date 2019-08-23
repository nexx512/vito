import VControlRepo from "./vcontrolrepo"
import Temperature from "../../../domain/models/temperature"
import HeatingMode from "../../../domain/models/heatingmode"
import FailureStatus from "../../../domain/models/failurestatus"
import Failures from "../../../domain/models/failures"
import Failure from "../../../domain/models/failure"
import DashboardInfos from "../../../domain/models/dashboardinfos"

export default class DashboardsRepo extends VControlRepo {

  async getDashboardInfos() {
    return await this.wrapConnection(async (client) => {
      const systemTimeString = await client.getData("getSystemTime");
      return new DashboardInfos(
        new Date(systemTimeString.split("\n")[0]),
        new Temperature(await client.getData("getTempA")),
        new Temperature(await client.getData("getTempRaumNorSollM1")),
        new Temperature(await client.getData("getTempRaumRedSollM1")),
        new HeatingMode(await client.getData("getBetriebArt")),
        new Temperature(await client.getData("getTempKist")),
        new Temperature(await client.getData("getTempWWist")),
        new Temperature(await client.getData("getTempWWsoll")),
        new FailureStatus(await client.getData("getStatusStoerung"))
      );
    })
  }

  async setRoomTemperature(roomTemperature: Temperature) {
    return await this.wrapConnection(async (client) => {
      await client.setData("setTempRaumNorSollM1", roomTemperature.temperature.toString());
    })
  }

  async setReducedRoomTemperature(reducedRoomTemperature: Temperature) {
    return await this.wrapConnection(async (client) => {
      await client.setData("setTempRaumRedSollM1", reducedRoomTemperature.temperature.toString());
    })
  }

  async getFailures() {
    return await this.wrapConnection(async (client) => {
      const failures = new Failures();
      for (let i = 0; i < 10; ++i) {
        failures.add(new Failure(await client.getData("getError" + i)));
      }
      return failures;
    });
  }

}
