type ErrorType =
  | "Developer"
  | "Unknown"
  | "Service"
  | "Authentication"
  | "Validation";

const errorCodes: { [k in ErrorType]: number } = {
  Developer: 409,
  Service: 412,
  Unknown: 408,
  Authentication: 402,
  Validation: 405,
};

export class AppError {
  public statusCode: number;

  constructor(
    errorType: ErrorType,
    public status: string,
    public message?: string
  ) {
    this.statusCode = errorCodes[errorType];
  }
}
