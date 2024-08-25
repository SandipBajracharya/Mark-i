export class CustomError extends Error {
  private statusCode: number;
  // TODO: accept object as well
  constructor(message: string, statusCode: number) {
    super(message); // calls the constructor of parent class i.e. of Error class. Error class expects message so sending message as param in super()
    this.statusCode = statusCode;
  }
}
