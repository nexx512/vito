export default class Notifications {
  constructor(public errors: string[] = [], public successes: string[] = []) {
  }

  addError(error: string) {
    this.errors.push(error);
  }

  addSuccess(success: string) {
    this.successes.push(success);
  }
}
