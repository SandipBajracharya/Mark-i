export class ControllerResponse<T> {
  data?: T;
  message?: string;
}

export class ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
