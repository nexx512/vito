export default class BurnerStatus {

  public power: number;
  public isBurning: boolean;

  constructor(power: string) {
    this.power = parseFloat(power);
    this.isBurning = !!this.power;
  }
}
