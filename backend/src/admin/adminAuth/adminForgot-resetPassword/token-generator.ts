export function generateNumericToken(length: number): string {
  const multiplier = Math.pow(10, length - 1);
  return Math.floor(multiplier + Math.random() * (9 * multiplier)).toString();
}
