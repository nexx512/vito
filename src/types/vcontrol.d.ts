declare module "vcontrol" {
  export default class VControlClient {
    constructor (config: {
      host:string,
      port:number,
      debug?:boolean
    })
    connect(): void
    close(): void
    getData(command:string): string
    setData(command: string, data: string|string[]): void
  }
}
