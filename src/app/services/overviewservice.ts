import VControlRepo from "../repo/vcontrol/vcontrolrepo"
import HeatingStatus from "../models/heatingstatus"

export default class OverviewService {

  constructor(private repo: VControlRepo) {
  }

  async getGeneralHeatingStatus() {
    let heatingStatus = new HeatingStatus()
    heatingStatus.systemTime = await this.repo.getSystemTime()
    heatingStatus.outsideTemp = await this.repo.getOutsideTemp()
    heatingStatus.failureStatus = await this.repo.getFailureStatus()
    return heatingStatus
  }

}
