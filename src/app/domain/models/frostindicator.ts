export default class FrostIndicator {

  public hasWarning: boolean;

  constructor(frostWarning: string) {
    this.hasWarning = !!parseInt(frostWarning);

  }
}
