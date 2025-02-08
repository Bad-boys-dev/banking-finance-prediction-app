class NotFound extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export default NotFound;
