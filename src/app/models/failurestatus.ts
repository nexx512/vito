export default class FailureStatus {

  hasFailure: boolean = false;

  constructor (failureString: String) {
    this.hasFailure = failureString != "OK"
  }

}
