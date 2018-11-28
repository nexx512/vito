should = require("should")
WeekCycleTimesConverter = require("../../../../dist/webapp/converter/weekcycletimesconverter").default
WeekCycleTimes = require("../../../../dist/app/models/weekcycletimes").default
CycleTimes = require("../../../../dist/app/models/cycletimes").default
CycleTime = require("../../../../dist/app/models/cycletime").default
Time = require("../../../../dist/app/models/time").default

describe "A WeekCycleTimes converet", =>

  it "should transform a WeekCycleTimes model to a WeekCycleTimesDto", =>
    cycleTimes = new CycleTimes()
    cycleTimes.add(new CycleTime(new Time("00:01"), new Time("00:0a")))
    weekCycleTimesModel = new WeekCycleTimes(cycleTimes)
    weekCycleTimesModel.validate()

    convertedWeekCycleTimesReponseDto = WeekCycleTimesConverter.toWeekCycleTimesResponseDto(weekCycleTimesModel)

    weekCycleTimesReponseDto =
      monday: new Array()
      tuesday: new Array()
      wednesday: new Array()
      thursday: new Array()
      friday: new Array()
      saturday: new Array()
      sunday: new Array()
    weekCycleTimesReponseDto.monday[0] =
      on:
        time: "00:01"
        errors: []
      off:
        time: "00:0a"
        errors: ["Time format invalid"]
    convertedWeekCycleTimesReponseDto.monday.length.should.equal(1)
    convertedWeekCycleTimesReponseDto.should.eql(weekCycleTimesReponseDto)

  it "should transform a WeekCycleTimerDto to a WeekCycleTimesModel", =>
    weekCycleTimesReponseDto =
      monday: [
        {on: "00:01", off: "00:0a"},
        {on: "", off: ""},
        {on: "", off: ""},
        {on: "", off: ""}
      ]

    convertedWeekCycleTimesModel = WeekCycleTimesConverter.toWeekCycleTimesModel(weekCycleTimesReponseDto)

    cycleTimes = new CycleTimes()
    cycleTimes.add(new CycleTime(new Time("00:01"), new Time("00:0a")))
    weekCycleTimesModel = new WeekCycleTimes(cycleTimes)
    convertedWeekCycleTimesModel.should.eql(weekCycleTimesModel)
