

export function generateNumericToken(length: number): string {
    const multiplier = Math.pow(10, length - 1); // Ensures token has required number of digits
    return Math.floor(multiplier + Math.random() * (9 * multiplier)).toString();
}
