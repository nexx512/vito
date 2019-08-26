export default class HeatingCirculation {

  public isActive: boolean;

  constructor(pumpStatus: string, valveStatus: string) {
    this.isActive = !!parseInt(pumpStatus) && valveStatus.startsWith("Heizen")
  }
}
