export default class FailureStatus {

  hasFailure: boolean = false;

  constructor (failureString: string) {
    this.hasFailure = !!parseInt(failureString)
  }

}
