export default class HeatingCirculation {

  public isActive: boolean;

  constructor(pumpStatus: string, valveStatus: string) {
    this.isActive = parseInt(pumpStatus) === 1 && valveStatus.startsWith("Heizen") 
  }
}
