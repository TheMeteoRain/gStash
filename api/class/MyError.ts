export default class MyError extends Error {
  public status: number

  public constructor(...args: string[]) {
    super(...args)
  }
}