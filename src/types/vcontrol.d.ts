declare module "vcontrol" {
  export default class VControlClient {
    constructor (config: {
      host:string,
      port:number,
      debug?:boolean
    })
    connect(): Promise<void>
    close(): Promise<void>
    getData(command:string): Promise<string>
    setData(command: string, data: string|string[]): Promise<void>
  }
}
