class ErrorHandler extends Error {
  statusCode: number;

  constructor(errMessage: string, statusCode: number) {
    super(errMessage); // this catches the error message from parent class Error
    this.statusCode = statusCode;
  }
}
export default ErrorHandler;
