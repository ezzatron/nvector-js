export function angleDelta(a: number, b: number): number {
  const delta = Math.abs(a - b) % (2 * Math.PI);

  return Math.min(delta, 2 * Math.PI - delta);
}
