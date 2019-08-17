export default class LiveDateTimeController {
  constructor(view) {
    this.view = view;

    this.time = this.view.getStartDate().getTime();

    setInterval(() => this.increaseTime(), 1000);
  }

  increaseTime() {
    this.time += 1000;
    this.view.setDate(new Date(this.time));
  }
}
