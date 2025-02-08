class NotAuthorized extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export default NotAuthorized;
