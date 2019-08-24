import Temperature from "./temperature"
import HeatingMode from "./heatingmode"
import FailureStatus from "./failurestatus"
import FrostIndicator from "./frostindicator"
import BurnerStatus from "./burnerstatus"
import WarmWaterStatus from "./warmwaterstatus"

export default class HeatingStatus {

  constructor(
    public frostIndicator: FrostIndicator,
    public systemTime: Date,
    public outsideTemp: Temperature,
    public roomTemp: Temperature,
    public reducedRoomTemp: Temperature,
    public heatingMode: HeatingMode,
    public burnerTemp: Temperature,
    public waterTemp: Temperature,
    public waterTargetTemp: Temperature,
    public failureStatus: FailureStatus,
    public burnerStatus: BurnerStatus,
    public warmWaterStatus: WarmWaterStatus
  ) {
  }

}
