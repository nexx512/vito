puppeteer = require("puppeteer")

module.exports = class Browser
  constructor: () ->

  start: () ->
    @browser = await puppeteer.launch()#headless: false, slowMo:250)

  createPage: () ->
    page = await @browser.newPage()

    page.fill = (selector, text) ->
      await page.$eval(selector, (node) -> node.value = "")
      await page.type(selector, text)

    page.inputValue = (selector) ->
      await page.$eval(selector, (node) -> node.value)

    page.elements = (selector) ->
      (await page.$$(selector)).length

    page.clickNavigate = (selector) ->
      Promise.all([page.waitForNavigation(), page.click(selector)])

    page
