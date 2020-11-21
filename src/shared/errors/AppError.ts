export default class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly error: string;

  constructor(message: string, error = 'Bad Request', statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}
