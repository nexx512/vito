should = require('should')
VControlRepo = require('../../repo/vcontrolrepo')
WeekTimerTimes = require("../../models/weektimertimes")
TimerTimes = require("../../models/timertimes")
TimerTime = require("../../models/timertime")

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
      Object.keys(times).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

  describe('requesting warmwater circulation times', () => {
    it('should return times for all weekdays', async () => {
      let times = await vControlRepo.getWarmWaterCirculationTimes()
      Object.keys(times).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

  describe('setting warmwater circulation times', () => {
    it('should set the heatind times', async () => {
      let timerTimesMonday = new TimerTimes()
      timerTimesMonday.add(new TimerTime("12:23", "13:24"))
      timerTimesMonday.add(new TimerTime("23:12", "24:00"))
      let timerTimesWednesday = new TimerTimes()
      timerTimesWednesday.add(new TimerTime("02:23", "03:24"))
      timerTimesWednesday.add(new TimerTime("03:12", "04:00"))
      let weekTimerTimes = new WeekTimerTimes(timerTimesMonday, null, timerTimesWednesday)

      let times = await vControlRepo.setWarmWaterCirculationTimes(weekTimerTimes)

      vControlClientMock.data.should.equal("setTimerZirkuMo 12:23 13:24 23:12 24:00\nsetTimerZirkuMi 02:23 03:24 03:12 04:00\n")
    })
  })
})
