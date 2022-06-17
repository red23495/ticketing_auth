import BaseError, { SerializedErrorDetail } from "./base";

interface BadRequestErrorProps {
  message: string;
  status?: number;
  details?: SerializedErrorDetail[];
}

export default class BadRequestError extends BaseError {
  private details: SerializedErrorDetail[];

  constructor({
    message = "Some Error Occurred",
    status = 400,
    details = [],
  }: BadRequestErrorProps) {
    super(message, status);
    this.details = details;
  }

  get errorDetails(): SerializedErrorDetail[] {
    return this.details;
  }
}
