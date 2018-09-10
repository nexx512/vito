should = require('should')
VControlRepo = require('../../../repo/vcontrol/vcontrolrepo')
WeekTimerTimes = require("../../../models/weektimertimes")
TimerTimes = require("../../../models/timertimes")
TimerTime = require("../../../models/timertime")
Time = require("../../../models/time")

describe('A VControlRepo object', () => {

  class VControlClientMock {
    constructor() {
      this.data = ""
    }

    connect() {}
    close() {}

    getData(command) {
      return "An:00:00  Aus:24:00\n"
    }

    setData(command, values) {
      this.data += command + " " + values.join(" ") + "\n"
    }
  }

  let vControlRepo
  let vControlClientMock

  before(() => {
    vControlClientMock = new VControlClientMock()
    vControlRepo = new VControlRepo(vControlClientMock)
  })

  describe('requesting warmwater heating times', () => {
    it('should return times for all weekdays', async () => {
      let times = await vControlRepo.getWarmWaterHeatingTimes()
      Object.keys(times.days).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

  describe('requesting warmwater circulation times', () => {
    it('should return times for all weekdays', async () => {
      let times = await vControlRepo.getWarmWaterCirculationTimes()
      Object.keys(times.days).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

  describe('setting warmwater circulation times', () => {
    it('should set the heatind times', async () => {
      let timerTimesMonday = new TimerTimes()
      timerTimesMonday.add(new TimerTime(new Time("12:23"), new Time("13:24")))
      timerTimesMonday.add(new TimerTime(new Time("23:12"), new Time("24:00")))
      let timerTimesWednesday = new TimerTimes()
      timerTimesWednesday.add(new TimerTime(new Time("02:23"), new Time("03:24")))
      timerTimesWednesday.add(new TimerTime(new Time("03:12"), new Time("04:00")))
      let weekTimerTimes = new WeekTimerTimes(timerTimesMonday, null, timerTimesWednesday)

      let times = await vControlRepo.setWarmWaterCirculationTimes(weekTimerTimes)

      vControlClientMock.data.should.equal("setTimerZirkuMo 12:23 13:24 23:12 24:00\nsetTimerZirkuMi 02:23 03:24 03:12 04:00\n")
    })
  })
})
