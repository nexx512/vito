import DashboardsRepo from "../../adapters/passive/vcontrol/dashboardsrepo"
import Temperature from "../models/temperature"
import ValidationError from "../models/validationerror"
import ValidationErrors from "../models/validationerrors"

export default class OverviewService {
  constructor(private repo: DashboardsRepo) {
  }

  async getDashboardInfos() {
    return await this.repo.getDashboardInfos();
    // TODO:
    // Tag/Nachtbetrieb
    // Frostschutz
    // Kesseltemperatur
    // Brennerbetrieb
    // Vorlauftemperatur
    // Warmwassertemperatur
  }

  async setRoomTemperatures(roomTemperature: Temperature, reducedRoomTemperature: Temperature) {
    let errors = [];
    if (roomTemperature.validate()) {
      await this.repo.setRoomTemperature(roomTemperature);
    } else {
      errors.push(new ValidationError("Room temperature invalid"));
    }

    if (reducedRoomTemperature.validate()) {
      await this.repo.setReducedRoomTemperature(reducedRoomTemperature);
    } else {
      errors.push(new ValidationError("Reduced room temperature invalid"));
    }

    if (errors.length > 0) {
      throw new ValidationError("Room temperatures invalid",  new ValidationErrors(errors));
    }
  }

}
