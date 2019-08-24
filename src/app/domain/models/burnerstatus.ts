export default class BurnerStatus {

  public power: number;
  public isActive: boolean;

  constructor(powerString: string) {
    this.power = parseFloat(powerString);
    this.isActive = !!this.power;
  }
}
