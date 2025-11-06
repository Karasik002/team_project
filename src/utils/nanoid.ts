const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const nanoid = (prefix = 'id', length = 10): string => {
  let suffix = '';
  const characters = alphabet + alphabet.toUpperCase();
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * characters.length);
    suffix += characters[index];
  }
  return `${prefix}-${suffix}`;
};
