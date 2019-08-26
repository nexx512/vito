export default class WarmWaterStatus {

  public isHeating: boolean;

  constructor(loadingPumpStatus: string) {
    this.isHeating = !!parseInt(loadingPumpStatus);
  }

}
