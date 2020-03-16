import VControlClient from "vcontrol";

import MappingVControlClient from "./mappingvcontrolclient";

export default class VControlRepo {
  constructor(private vControlClient: VControlClient) {
    //xxx = new MappingVControlClient(vControlClient);
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
