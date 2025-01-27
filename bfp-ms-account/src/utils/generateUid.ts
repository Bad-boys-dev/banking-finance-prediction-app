interface IPayload {
  debtorName: string;
  creditorName: string;
}

export default (payload: IPayload): string => {
  const randomString = Math.random().toString(36).substring(2, 8);

  const hash = Buffer.from(`${payload.debtorName}:${payload.creditorName}`)
    .toString('base64')
    .substring(0, 6);

  return `${hash}-${randomString}-${Date.now()}`;
};
