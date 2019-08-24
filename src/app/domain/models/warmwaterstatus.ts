export default class WarmWaterStatus {

  public isHeating: boolean;

  constructor(status: string) {
    this.isHeating = parseInt(status) === 1;
  }

}
