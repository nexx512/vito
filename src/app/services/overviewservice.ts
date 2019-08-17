import VControlRepo from "../repo/vcontrol/vcontrolrepo"
import HeatingStatus from "../models/heatingstatus"

export default class OverviewService {

  constructor(private repo: VControlRepo) {
  }

  async getGeneralHeatingStatus() {
    let heatingStatus = new HeatingStatus()
    heatingStatus.systemTime = await this.repo.getSystemTime()
    heatingStatus.outsideTemp = await this.repo.getOutsideTemp()
    heatingStatus.roomTemp = await this.repo.getRoomTemp()
    heatingStatus.heatingMode = await this.repo.getHeatingMode()
    heatingStatus.failureStatus = await this.repo.getFailureStatus()
    heatingStatus.failures = await this.repo.getFailures()
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
