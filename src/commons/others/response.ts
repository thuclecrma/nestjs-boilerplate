export class Response<T> {
  data: T;
  message: string;

  constructor(data: T, message = 'Success') {
    this.data = data;
    this.message = message;
  }
}
