import VControlClient from "vcontrol";

export default class VControlRepo {
  constructor(private vControlClient: VControlClient) {
  }

  protected async wrapConnection<T>(callback: (client: VControlClient) => Promise<T>): Promise<T> {
    await this.vControlClient.connect();
    try {
      let result = await callback(this.vControlClient);
      await this.vControlClient.close();
      return result;
    } catch (e) {
      await this.vControlClient.close();
      throw e;
    }
  }

}
