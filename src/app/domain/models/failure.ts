export default class Failure {

  isFailure:boolean = false;
  time: Date|null|undefined;
  code: number|undefined;
  message: String|undefined;

  constructor (failureString:String) {
    const failureElements = failureString.match(/^(\d{2,4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\+\d{4} (.*) \(([0-9a-fA-F]*)\)/);
    if (failureElements) {
      this.code = parseInt(failureElements[3], 16);
      this.message = failureElements[2];
      if (this.code > 0) {
        this.isFailure = true;
        this.time = new Date(failureElements[1]);
      } else {
        this.time = null
      }
    }
  }

}
