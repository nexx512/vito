export default class FrostIndicator {

  public hasWarning: boolean;

  constructor(status: string) {
    this.hasWarning = parseInt(status) === 1;

  }
}
