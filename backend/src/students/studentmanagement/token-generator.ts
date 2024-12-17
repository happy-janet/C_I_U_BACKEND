export function generateNumericToken(length: number): string {
  let token = '';
  for (let i = 0; i < length; i++) {
    token += Math.floor(Math.random() * 10).toString(); // Generates a random digit
  }
  return token;
}
