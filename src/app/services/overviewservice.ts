import VControlRepo from "../repo/vcontrol/vcontrolrepo"
import HeatingStatus from "../models/heatingstatus"

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

}
