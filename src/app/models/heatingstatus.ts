import Temperature from "./temperature"
import FailureStatus from "./failurestatus"

export default class HeatingStatus {

  systemTime: Date|undefined
  outsideTemp: Temperature|undefined
  failureStatus: FailureStatus|undefined;

  constructor() {
  }

}
