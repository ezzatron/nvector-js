export function angleDelta(a: number, b: number): number {
  return Math.PI - Math.abs(Math.abs(a - b) - Math.PI);
}

export function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
