import VControlClient from "vcontrol";

import CommandMapper from "./commandmapper";

export default class MappingVControlClient  {

  private commandMapper: CommandMapper = new CommandMapper();
  private vControlClient: VControlClient;

  constructor (vControlClient: VControlClient) {
    this.vControlClient = vControlClient;
  }

  getData(command: string): string {
    return this.vControlClient.getData(this.commandMapper.commandFor(command))
  }

  setData(command: string, data: string|string[]): void {
    return this.vControlClient.setData(this.commandMapper.commandFor(command), data);
  }

}
