import VControlRepo from "./vcontrolrepo"
import Temperature from "../../../domain/models/temperature"
import HeatingMode from "../../../domain/models/heatingmode"
import FailureStatus from "../../../domain/models/failurestatus"
import Failures from "../../../domain/models/failures"
import Failure from "../../../domain/models/failure"
import FrostIndicator from "../../../domain/models/frostindicator"
import DashboardInfos from "../../../domain/models/dashboardinfos"
import BurnerStatus from "../../../domain/models/burnerstatus"
import WarmWaterStatus from "../../../domain/models/warmwaterstatus"
import HeatingCirculation from "../../../domain/models/heatingcirculation"
import WarmWaterCirculation from "../../../domain/models/warmwatercirculation"

export default class DashboardsRepo extends VControlRepo {

  async getDashboardInfos() {
    return await this.wrapConnection(async (client) => {
      const systemTimeString = await client.getData("getSystemTime");
      return new DashboardInfos(
        new FrostIndicator(await client.getData("getStatusFrost")),
        new Date(systemTimeString.split("\n")[0]),
        new Temperature(await client.getData("getTempA")),
        new Temperature(await client.getData("getTempRaumNorSoll")),
        new Temperature(await client.getData("getTempRaumRedSoll")),
        new HeatingMode(await client.getData("getBetriebArt")),
        new Temperature(await client.getData("getTempKist")),
        new Temperature(await client.getData("getTempWWist")),
        new Temperature(await client.getData("getTempWWsoll")),
        new FailureStatus(await client.getData("getStatusStoerung")),
        new BurnerStatus(await client.getData("getBrennerStatus")),
        new WarmWaterStatus(await client.getData("getPumpeStatusSp")),
        new HeatingCirculation(await client.getData("getPumpeStatusIntern"), await client.getData("getUmschaltventil")),
        new WarmWaterCirculation(await client.getData("getPumpeStatusZirku"))
      );
    })
  }

  async setRoomTemperature(roomTemperature: Temperature) {
    return await this.wrapConnection(async (client) => {
      await client.setData("setTempRaumNorSoll", roomTemperature.temperature.toString());
    })
  }

  async setReducedRoomTemperature(reducedRoomTemperature: Temperature) {
    return await this.wrapConnection(async (client) => {
      await client.setData("setTempRaumRedSoll", reducedRoomTemperature.temperature.toString());
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
