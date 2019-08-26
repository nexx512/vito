export default class WarmWaterCirculation {

  public isActive: boolean;

  constructor(circulationPumpStatus: string) {
    this.isActive = !!parseInt(circulationPumpStatus);
  }
}
