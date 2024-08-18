export function getFirstGroup(regexp: RegExp, str: string): string[] {
  return Array.from(str.matchAll(regexp), m => m[1]);
}
