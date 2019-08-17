export default class LiveDateTimeView {
  constructor(el) {
    this.el = el;

    this.locale = this.el.getAttribute("data-locale");

    this.date = el.querySelector(".liveDateTime__date");
    this.time = el.querySelector(".liveDateTime__time");
  }

  getStartDate() {
    return new Date(this.el.getAttribute("data-date"));
  }

  setDate(date) {
    this.date.innerText = date.toLocaleDateString(this.locale);
    this.time.innerText = date.toLocaleTimeString(this.locale);
  }
}
