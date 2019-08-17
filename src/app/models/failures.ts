import Failure from "./failure"

export default class Failures {

  items: Failure[] = [];

  constructor () {
  }

  add(failure: Failure) {
    if (failure.isFailure) {
      this.items.push(failure);
    }
  }

}
