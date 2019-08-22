import VControlRepo from "../repo/vcontrol/vcontrolrepo"
import HeatingStatus from "../models/heatingstatus"
import Temperature from "../models/temperature"
import ValidationError from "../models/validationerror"
import ValidationErrors from "../models/validationerrors"

export default class OverviewService {
  constructor(private repo: VControlRepo) {
  }

  async getGeneralHeatingStatus() {
    let heatingStatus = new HeatingStatus(
      await this.repo.getSystemTime(),
      await this.repo.getOutsideTemp(),
      await this.repo.getRoomTemp(),
      await this.repo.getReducedRoomTemp(),
      await this.repo.getHeatingMode(),
      await this.repo.getBurnerTemp(),
      await this.repo.getWaterTemp(),
      await this.repo.getWaterTargetTemp(),
      await this.repo.getFailureStatus(),
      await this.repo.getFailures()
    );
    // TODO:
    // Tag/Nachtbetrieb
    // Frostschutz
    // Kesseltemperatur
    // Brennerbetrieb
    // Vorlauftemperatur
    // Warmwassertemperatur
    return heatingStatus
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
