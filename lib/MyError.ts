export default class MyError extends Error {
  public status: number

  public constructor(message: string) {
    super(message)
  }
}
