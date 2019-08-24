export default class BurnerStatus {

  public power: number;
  public isBurning: boolean;

  constructor(powerString: string) {
    this.power = parseFloat(powerString);
    this.isBurning = !!this.power;
  }
}
