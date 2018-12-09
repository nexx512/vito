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

    Object.keys(convertedWeekCycleTimesReponseDto).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    convertedWeekCycleTimesReponseDto.monday.length.should.equal(4)
    convertedWeekCycleTimesReponseDto.monday[0].should.eql(
      on:
        time: "00:01"
        errors: []
      off:
        time: "00:0a"
        errors: ["Time format invalid"]
    )
    convertedWeekCycleTimesReponseDto.monday[1].should.eql(
      on:
        time: null
        errors: []
      off:
        time: null
        errors: []
    )

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
