import type { Matrix } from "./matrix.js";
import type { Vector } from "./vector.js";

// A small number used to avoid Euler angle singularities.
const eulerThreshold = Number.EPSILON * 10;

/**
 * Converts Euler angles in XYZ order to a rotation matrix.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/xyz2R.m
 *
 * @param x - Rotation around the x-axis in radians.
 * @param y - Rotation around the y-axis in radians.
 * @param z - Rotation around the z-axis in radians.
 *
 * @returns A rotation matrix.
 */
export function eulerXYZToRotationMatrix(
  x: number,
  y: number,
  z: number,
): Matrix {
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cx = Math.cos(x);
  const sx = Math.sin(x);

  return [
    [cy * cz, -cy * sz, sy],
    [sy * sx * cz + cx * sz, -sy * sx * sz + cx * cz, -cy * sx],
    [-sy * cx * cz + sx * sz, sy * cx * sz + sx * cz, cy * cx],
  ];
}

/**
 * Converts Euler angles in ZYX order to a rotation matrix.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/zyx2R.m
 *
 * @param z - Rotation around the z-axis in radians.
 * @param y - Rotation around the y-axis in radians.
 * @param x - Rotation around the x-axis in radians.
 *
 * @returns A rotation matrix.
 */
export function eulerZYXToRotationMatrix(
  z: number,
  y: number,
  x: number,
): Matrix {
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cx = Math.cos(x);
  const sx = Math.sin(x);

  return [
    [cz * cy, -sz * cx + cz * sy * sx, sz * sx + cz * sy * cx],
    [sz * cy, cz * cx + sz * sy * sx, -cz * sx + sz * sy * cx],
    [-sy, cy * sx, cy * cx],
  ];
}

/**
 * Converts a rotation matrix to Euler angles in XYZ order.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R2xyz.m
 *
 * @param rotation - A rotation matrix.
 *
 * @returns The Euler angles in XYZ order.
 */
export function rotationMatrixToEulerXYZ([
  [r11, r12, r13],
  [r21, r22, r23],
  [, , r33],
]: Matrix): Vector {
  // cy is based on as many elements as possible, to average out numerical
  // errors. It is selected as the positive square root since y: [-pi/2 pi/2]
  const cy = Math.sqrt((r11 ** 2 + r12 ** 2 + r23 ** 2 + r33 ** 2) / 2);

  let x, y, z;

  // Check if (close to) Euler angle singularity:
  if (cy > eulerThreshold) {
    // Outside singularity:
    // atan2: [-pi pi]
    z = Math.atan2(-r12, r11);
    x = Math.atan2(-r23, r33);

    const sy = r13;

    y = Math.atan2(sy, cy);
  } else {
    // In singularity (or close to), i.e. y = +pi/2 or -pi/2:
    // Selecting y = +-pi/2, with correct sign
    y = (Math.sign(r13) * Math.PI) / 2;

    // Only the sum/difference of x and z is now given, choosing x = 0:
    x = 0;

    // Lower left 2x2 elements of rotation now only consists of sin z and cos z.
    // Using the two whose signs are the same for both singularities:
    z = Math.atan2(r21, r22);
  }

  return [x, y, z];
}

/**
 * Converts a rotation matrix to Euler angles in ZYX order.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R2zyx.m
 *
 * @param rotation - A rotation matrix.
 *
 * @returns The Euler angles in ZYX order.
 */
export function rotationMatrixToEulerZYX([
  [r11, r12],
  [r21, r22],
  [r31, r32, r33],
]: Matrix): Vector {
  // cy is based on as many elements as possible, to average out numerical
  // errors. It is selected as the positive square root since y: [-pi/2 pi/2]
  const cy = Math.sqrt((r11 ** 2 + r21 ** 2 + r32 ** 2 + r33 ** 2) / 2);

  let z, y, x;

  // Check if (close to) Euler angle singularity:
  if (cy > eulerThreshold) {
    // Outside singularity:
    // atan2: [-pi pi]
    z = Math.atan2(r21, r11);
    x = Math.atan2(r32, r33);

    const sy = -r31;

    y = Math.atan2(sy, cy);
  } else {
    // In singularity (or close to), i.e. y = +pi/2 or -pi/2:
    // Selecting y = +-pi/2, with correct sign
    y = (Math.sign(r31) * Math.PI) / 2;

    // Only the sum/difference of x and z is now given, choosing x = 0:
    x = 0;

    // Upper right 2x2 elements of rotation now only consists of sin z and cos
    // z. Using the two whose signs are the same for both singularities:
    z = Math.atan2(-r12, r22);
  }

  return [z, y, x];
}
