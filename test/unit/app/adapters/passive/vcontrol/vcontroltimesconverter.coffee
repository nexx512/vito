should = require("should")
VControlTimesConverter = require("../../../../../../dist/app/adapters/passive/vcontrol/vcontroltimesconverter").default
CycleTimes = require("../../../../../../dist/app/domain/models/cycletimes").default
CycleTime = require("../../../../../../dist/app/domain/models/cycletime").default
Time = require("../../../../../../dist/app/domain/models/time").default

describe "Convert VControl get command times to CycleTimes", =>
  describe "with times at the boundaries", =>
    it "should return valid times", =>
      cycleTimes = VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes("1:An:00:00  Aus:24:00\n")

      expectedCycleTimes = new CycleTimes()
      expectedCycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.should.eql(expectedCycleTimes)

  describe "without times", =>
    it "should return null values", =>
      cycleTimes = VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes("3:An:--     Aus:--\n")

      expectedCycleTimes = new CycleTimes()
      expectedCycleTimes.add(new CycleTime(new Time(null), new Time(null)))
      cycleTimes.should.eql(expectedCycleTimes)

  describe "with a time block string", =>
    it "should return valid times", =>
      cycleTimes = VControlTimesConverter.fromVControlGetCommandTimesToCycleTimes("1:An:00:00  Aus:24:00\n2:An:01:02  Aus:14:15\n3:An:--     Aus:--\n\n")

      expectedCycleTimes = new CycleTimes()
      expectedCycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      expectedCycleTimes.add(new CycleTime(new Time("01:02"), new Time("14:15")))
      expectedCycleTimes.add(new CycleTime(new Time(null), new Time(null)))
      cycleTimes.should.eql(expectedCycleTimes)

describe "Convert CycleTimes to VControl set command times", =>
  it "should return a string with times", =>
    cycleTimes = new CycleTimes()
    cycleTimes.add(new CycleTime(new Time("00:00"), new Time("12:23")))
    cycleTimes.add(new CycleTime(new Time("23:12"), new Time("23:45")))

    vControlTimes = VControlTimesConverter.fromCycleTimesToVControlSetCommandTimes(cycleTimes)

    vControlTimes.should.eql(["00:00", "12:23", "23:12", "23:45"])
