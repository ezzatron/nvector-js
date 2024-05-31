import { Z_AXIS_NORTH } from "./coord-frame.js";
import { toGeodeticCoordinates } from "./coords.js";
import { eulerXYZToRotationMatrix } from "./euler.js";
import { multiply, transpose, type Matrix } from "./matrix.js";
import type { Vector } from "./vector.js";
import { transform } from "./vector.js";

/**
 * Converts a rotation matrix to an n-vector.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_EL2n_E.m
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_EN2n_E.m
 *
 * @param rotation - A rotation matrix.
 *
 * @returns An n-vector.
 */
export function fromRotationMatrix(rotation: Matrix): Vector {
  return transform(rotation, [0, 0, -1]);
}

/**
 * Converts n-vector to a rotation matrix.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/n_E2R_EN.m
 *
 * @param vector - An n-vector.
 * @param frame - Coordinate frame in which the n-vector is decomposed.
 *
 * @returns A rotation matrix.
 */
export function toRotationMatrix(
  vector: Vector,
  frame: Matrix = Z_AXIS_NORTH,
): Matrix {
  // frame selects correct E-axes
  const [x, y, z] = transform(frame, vector);

  // N coordinate frame (North-East-Down) is defined in Table 2 in Gade (2010)

  // rEN is constructed by the following three column vectors: The x, y and z
  // basis vectors (axes) of N, each decomposed in E.

  // Find z-axis of N (Nz):
  // z-axis of N (down) points opposite to n-vector
  const zx = -x;
  const zy = -y;
  const zz = -z;

  // Find y-axis of N (East)(remember that N is singular at Poles)
  // Equation (9) in Gade (2010):
  // Ny points perpendicular to the plane formed by n-vector and Earth's spin
  // axis
  const yyDir = -z;
  const yzDir = y;
  const yDirNorm = Math.hypot(yyDir, yzDir);
  const onPoles = Math.hypot(yyDir, yzDir) === 0;
  // yx is always 0, so it's factored out in the following equations
  const yy = onPoles
    ? 1 // Pole position: selected y-axis direction
    : yyDir / yDirNorm; // outside Poles:
  const yz = onPoles
    ? 0 // Pole position: selected y-axis direction
    : yzDir / yDirNorm; // outside Poles:

  // Find x-axis of N (North):
  // Final axis found by right hand rule
  const xx = yy * zz - yz * zy;
  const xy = yz * zx;
  const xz = -yy * zx;

  // Form rotation from the unit vectors:
  // frame selects correct E-axes
  return multiply(transpose(frame), [
    [xx, 0, zx],
    [xy, yy, zy],
    [xz, yz, zz],
  ]);
}

/**
 * Converts an n-vector and a wander azimuth angle to a rotation matrix.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_E_and_wa2R_EL.m
 *
 * @param vector - An n-vector.
 * @param wanderAzimuth - A wander azimuth angle in radians.
 * @param frame - Coordinate frame in which the n-vector is decomposed.
 *
 * @returns A rotation matrix.
 */
export function toRotationMatrixUsingWanderAzimuth(
  vector: Vector,
  wanderAzimuth: number,
  frame: Matrix = Z_AXIS_NORTH,
): Matrix {
  const [longitude, latitude] = toGeodeticCoordinates(vector, frame);

  // Longitude, -latitude, and wander azimuth are the x-y-z Euler angles (about
  // new axes) for rotation. See also the second paragraph of Section 5.2 in
  // Gade (2010):

  // frame selects correct E-axes
  return multiply(
    transpose(frame),
    eulerXYZToRotationMatrix(longitude, -latitude, wanderAzimuth),
  );
}
