import DashboardsRepo from "../../adapters/passive/vcontrol/dashboardsrepo"
import Temperature from "../models/temperature"
import ValidationError from "../models/validationerror"

export default class OverviewService {
  constructor(private repo: DashboardsRepo) {
  }

  async getDashboardInfos() {
    return await this.repo.getDashboardInfos();
    // TODO:
    // Tag/Nachtbetrieb
    // Frostschutz
  }

  async setRoomTemperature(roomTemperature: Temperature) {
    if (roomTemperature.validate()) {
      await this.repo.setRoomTemperature(roomTemperature);
    } else {
      throw new ValidationError("Room temperature invalid");
    }
  }

  async setReducedRoomTemperature(reducedRoomTemperature: Temperature) {
    if (reducedRoomTemperature.validate()) {
      await this.repo.setReducedRoomTemperature(reducedRoomTemperature);
    } else {
      throw new ValidationError("Reduced room temperature invalid");
    }
  }

}
