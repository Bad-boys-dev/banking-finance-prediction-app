class UnprocessableContent extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export default UnprocessableContent;
