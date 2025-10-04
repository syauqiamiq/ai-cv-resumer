export function generateRandomNumber(length) {
  const min = Math.pow(10, length - 1); // Minimum value for the given length
  const max = Math.pow(10, length) - 1; // Maximum value for the given length
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
