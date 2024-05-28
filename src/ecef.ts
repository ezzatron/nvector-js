import { Z_AXIS_NORTH } from "./coord-frame.js";
import { WGS_84, type Ellipsoid } from "./ellipsoid.js";
import type { Matrix } from "./matrix.js";
import { transpose } from "./matrix.js";
import type { Vector } from "./vector.js";
import { normalize, transform } from "./vector.js";

/**
 * Converts an ECEF position vector to an n-vector and depth.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/p_EB_E2n_EB_E.m
 *
 * @param vector - An ECEF position vector.
 * @param ellipsoid - A reference ellipsoid.
 * @param frame - Coordinate frame in which the vectors are decomposed.
 *
 * @returns Representation of position B, decomposed in E, and depth in meters
 *   of system B relative to the ellipsoid.
 */
export function fromECEF(
  vector: Vector,
  { a, f }: Ellipsoid = WGS_84,
  frame: Matrix = Z_AXIS_NORTH,
): [vector: Vector, depth: number] {
  // frame selects correct E-axes
  const [x, y, z] = transform(frame, vector);

  // e2 = eccentricity^2
  const e2 = 2 * f - f ** 2;

  // The following code implements equation (23) from Gade (2010):

  const R2 = y ** 2 + z ** 2;
  // R = component of vector in the equatorial plane
  const R = Math.sqrt(R2);

  const x2 = x ** 2;

  const p = R2 / a ** 2;
  const q = ((1 - e2) / a ** 2) * x2;
  const r = (p + q - e2 ** 2) / 6;

  const s = (e2 ** 2 * p * q) / (4 * r ** 3);
  const t = Math.cbrt(1 + s + Math.sqrt(s * (2 + s)));
  const u = r * (1 + t + 1 / t);
  const v = Math.sqrt(u ** 2 + e2 ** 2 * q);

  const w = (e2 * (u + v - q)) / (2 * v);
  const k = Math.sqrt(u + v + w ** 2) - w;
  const d = (k * R) / (k + e2);

  // Calculate height:
  const hf = Math.sqrt(d ** 2 + x2);
  const h = ((k + e2 - 1) / k) * hf;

  const temp = 1 / hf;

  return [
    // Ensure unit length:
    normalize(
      transform(transpose(frame), [
        temp * x,
        ((temp * k) / (k + e2)) * y,
        ((temp * k) / (k + e2)) * z,
      ]),
    ),
    -h,
  ];
}

/**
 * Converts an n-vector and depth to an ECEF position vector.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_EB_E2p_EB_E.m
 *
 * @param vector - An n-vector.
 * @param depth - Depth of the position in meters, relative to the ellipsoid.
 * @param ellipsoid - A reference ellipsoid.
 * @param frame - Coordinate frame in which the n-vector is decomposed.
 *
 * @returns An ECEF position vector.
 */
export function toECEF(
  vector: Vector,
  depth: number = 0,
  { b, f }: Ellipsoid = WGS_84,
  frame: Matrix = Z_AXIS_NORTH,
): Vector {
  // frame selects correct E-axes
  const [x, y, z] = transform(frame, vector);

  // The following code implements equation (22) in Gade (2010):

  const denom = Math.hypot(x, y / (1 - f), z / (1 - f));

  // We first calculate the position at the origin of coordinate system L, which
  // has the same n-vector as B (bEL = bEB), but lies at the surface of the
  // Earth (depth = 0).

  const ex = (b / denom) * x;
  const ey = (b / denom) * (y / (1 - f) ** 2);
  const ez = (b / denom) * (z / (1 - f) ** 2);

  return transform(transpose(frame), [
    ex - x * depth,
    ey - y * depth,
    ez - z * depth,
  ]);
}
