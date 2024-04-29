import type { Matrix3x3 } from "./matrix.js";
import type { Vector3 } from "./vector.js";

/**
 * Calculates the Euler angles in the xyz-order from a rotation matrix.
 *
 * @param R_AB - A rotation matrix.
 *
 * @returns The angles of rotation about the new axes.
 */
export function R2xyz(R_AB: Matrix3x3): Vector3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L89
  const [[r00, r01, r02], [r10, r11, r12], [, , r22]] = R_AB;

  const cosY = Math.sqrt((r00 ** 2 + r01 ** 2 + r12 ** 2 + r22 ** 2) / 2);
  const sinY = r02;

  const nonSingular = cosY > 10 * Number.EPSILON;
  const x = nonSingular ? Math.atan2(-r12, r22) : 0;
  const y = nonSingular
    ? Math.atan2(sinY, cosY)
    : (Math.sign(sinY) * Math.PI) / 2;
  const z = nonSingular ? Math.atan2(-r01, r00) : Math.atan2(r10, r11);

  return [x, y, z];
}
