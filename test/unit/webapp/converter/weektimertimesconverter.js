should = require("should")
const WeekTimerTimesConverter = require("../../../../webapp/converter/weektimertimesconverter")
const WeekTimerTimes = require("../../../../models/weektimertimes")
const TimerTimes = require("../../../../models/timertimes")
const TimerTime = require("../../../../models/timertime")
const Time = require("../../../../models/time")

describe("A WeekTimerTimes converet", () => {

  it("should transform a WeekTimerTimes model to a WeekTimerTimesDto", () => {
    let timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime(new Time("00:01"), new Time("00:0a")))
    let weekTimerTimesModel = new WeekTimerTimes(timerTimes)
    weekTimerTimesModel.validate()

    let convertedWeekTimerTimesReponseDto = WeekTimerTimesConverter.toWeekTimerTimesResponseDto(weekTimerTimesModel)

    let weekTimerTimesReponseDto = {
      monday: new Array(4),
      tuesday: new Array(4),
      wednesday: new Array(4),
      thursday: new Array(4),
      friday: new Array(4),
      saturday: new Array(4),
      sunday: new Array(4)
    }
    weekTimerTimesReponseDto.monday[0] = {
      on: {
        time: "00:01",
        errors: []
      },
      off: {
        time: "00:0a",
        errors: ["Time format invalid"]
      }
    }
    convertedWeekTimerTimesReponseDto.monday.length.should.equal(4)
    convertedWeekTimerTimesReponseDto.should.eql(weekTimerTimesReponseDto)
  })

  it("should transform a WeekTimerTimerDto to a WeekTimerTimesModel", () => {
    let weekTimerTimesReponseDto = {
      monday: [
        {on: "00:01", off: "00:0a"},
        {on: "", off: ""},
        {on: "", off: ""},
        {on: "", off: ""}
      ]
    }

    let convertedWeekTimerTimesModel = WeekTimerTimesConverter.toWeekTimerTimesModel(weekTimerTimesReponseDto)

    let timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime(new Time("00:01"), new Time("00:0a")))
    let weekTimerTimesModel = new WeekTimerTimes(timerTimes)
    convertedWeekTimerTimesModel.should.eql(weekTimerTimesModel)
  })

})
