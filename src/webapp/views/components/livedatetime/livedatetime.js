import LiveDateTimeView from "./js/livedatetimeview"
import LiveDateTimeController from "./js/livedatetimecontroller"

export function liveDateTime(el) {
  return new LiveDateTimeController(new LiveDateTimeView(el));
}
