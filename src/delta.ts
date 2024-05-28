import { Z_AXIS_NORTH } from "./coord-frame.js";
import { fromECEF, toECEF } from "./ecef.js";
import { WGS_84, type Ellipsoid } from "./ellipsoid.js";
import type { Matrix } from "./matrix.js";
import type { Vector } from "./vector.js";

/**
 * Delta finds a delta ECEF position vector from a reference n-vector position,
 * and a target n-vector position.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_EA_E_and_n_EB_E2p_AB_E.m
 *
 * @param from - An n-vector of position A.
 * @param to - An n-vector of position B.
 * @param fromDepth - Depth of position A in meters, relative to the ellipsoid.
 * @param toDepth - Depth of position B in meters, relative to the ellipsoid.
 * @param ellipsoid - A reference ellipsoid.
 * @param frame - Coordinate frame in which the vectors are decomposed.
 *
 * @returns Position vector in meters from A to B, decomposed in E.
 */
export function delta(
  from: Vector,
  to: Vector,
  fromDepth: number = 0,
  toDepth: number = 0,
  ellipsoid: Ellipsoid = WGS_84,
  frame: Matrix = Z_AXIS_NORTH,
): Vector {
  // Function 1. in Section 5.4 in Gade (2010):
  const [ax, ay, az] = toECEF(from, fromDepth, ellipsoid, frame);
  const [bx, by, bz] = toECEF(to, toDepth, ellipsoid, frame);

  return [bx - ax, by - ay, bz - az];
}

/**
 * From position A and delta, finds position B.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_EA_E_and_p_AB_E2n_EB_E.m
 *
 * @param from - An n-vector of position A.
 * @param delta - ECEF position vector in meters from A to B.
 * @param fromDepth - Depth of position A in meters, relative to the ellipsoid.
 * @param ellipsoid - A reference ellipsoid.
 * @param frame - Coordinate frame in which the vectors are decomposed.
 *
 * @returns An n-vector of position B, and depth of position B in meters,
 *   relative to the ellipsoid.
 */
export function destination(
  from: Vector,
  [dx, dy, dz]: Vector,
  fromDepth: number = 0,
  ellipsoid: Ellipsoid = WGS_84,
  frame: Matrix = Z_AXIS_NORTH,
): [to: Vector, toDepth: number] {
  // Function 2. in Section 5.4 in Gade (2010):
  const [ax, ay, az] = toECEF(from, fromDepth, ellipsoid, frame);
  const b: Vector = [ax + dx, ay + dy, az + dz];

  return fromECEF(b, ellipsoid, frame);
}
