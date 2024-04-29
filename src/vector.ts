export type Vector3 = [x: number, y: number, z: number];
export type Vector4 = [x: number, y: number, z: number, w: number];

export function unitVector3([x, y, z]: Vector3): Vector3 {
  const norm = Math.hypot(x, y, z);

  return [x / norm, y / norm, z / norm];
}
