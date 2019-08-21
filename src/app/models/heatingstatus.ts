import Temperature from "./temperature"
import HeatingMode from "./heatingmode"
import FailureStatus from "./failurestatus"
import Failures from "./failures"

export default class HeatingStatus {

  constructor(
    public systemTime: Date,
    public outsideTemp: Temperature,
    public roomTemp: Temperature,
    public reducedRoomTemp: Temperature,
    public heatingMode: HeatingMode,
    public burnerTemp: Temperature,
    public waterTemp: Temperature,
    public waterTargetTemp: Temperature,
    public failureStatus: FailureStatus,
    public failures: Failures
  ) {
  }

}
