import Temperature from "./temperature"
import HeatingMode from "./heatingmode"
import FailureStatus from "./failurestatus"

export default class HeatingStatus {

  systemTime: Date|undefined
  outsideTemp: Temperature|undefined
  roomTemp: Temperature|undefined;
  heatingMode: HeatingMode|undefined;
  failureStatus: FailureStatus|undefined;

  constructor() {
  }

}
