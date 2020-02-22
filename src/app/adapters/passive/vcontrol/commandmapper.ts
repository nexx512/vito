let commands: {[key: string]: string} = {
  "getTimerM1Mo": "getTimerMo"
}

export default class CommandMapper {
  commandFor(key: string): string {
    if (commands.hasOwnProperty(key)) {
      return commands[key];
    } else {
      return key;
    }
  }
}
