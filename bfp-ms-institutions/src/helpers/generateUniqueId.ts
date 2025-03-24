const generateUniqueId = (length: number): string | undefined => {
  const letters: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let uuid: string = '';

  if (length >= 62) {
    return undefined;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * length);
    uuid += letters[randomIndex];
  }

  return uuid;
};

export default generateUniqueId;
