should = require("should")
WeekTimerTimesConverter = require("../../../../webapp/converter/weektimertimesconverter")
WeekTimerTimes = require("../../../../app/models/weektimertimes")
TimerTimes = require("../../../../app/models/timertimes")
TimerTime = require("../../../../app/models/timertime")
Time = require("../../../../app/models/time")

describe "A WeekTimerTimes converet", =>

  it "should transform a WeekTimerTimes model to a WeekTimerTimesDto", =>
    timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime(new Time("00:01"), new Time("00:0a")))
    weekTimerTimesModel = new WeekTimerTimes(timerTimes)
    weekTimerTimesModel.validate()

    convertedWeekTimerTimesReponseDto = WeekTimerTimesConverter.toWeekTimerTimesResponseDto(weekTimerTimesModel)

    weekTimerTimesReponseDto =
      monday: new Array(4)
      tuesday: new Array(4)
      wednesday: new Array(4)
      thursday: new Array(4)
      friday: new Array(4)
      saturday: new Array(4)
      sunday: new Array(4)
    weekTimerTimesReponseDto.monday[0] =
      on:
        time: "00:01"
        errors: []
      off:
        time: "00:0a"
        errors: ["Time format invalid"]
    convertedWeekTimerTimesReponseDto.monday.length.should.equal(4)
    convertedWeekTimerTimesReponseDto.should.eql(weekTimerTimesReponseDto)

  it "should transform a WeekTimerTimerDto to a WeekTimerTimesModel", =>
    weekTimerTimesReponseDto =
      monday: [
        {on: "00:01", off: "00:0a"},
        {on: "", off: ""},
        {on: "", off: ""},
        {on: "", off: ""}
      ]

    convertedWeekTimerTimesModel = WeekTimerTimesConverter.toWeekTimerTimesModel(weekTimerTimesReponseDto)

    timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime(new Time("00:01"), new Time("00:0a")))
    weekTimerTimesModel = new WeekTimerTimes(timerTimes)
    convertedWeekTimerTimesModel.should.eql(weekTimerTimesModel)
