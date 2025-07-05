
export { };

declare global {
  interface String {
    truncate(maxLength: number): string;
  }
}
