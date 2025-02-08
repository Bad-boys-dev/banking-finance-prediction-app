class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export default BadRequest;
