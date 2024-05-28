import { Z_AXIS_NORTH } from "./coord-frame.js";
import type { Matrix } from "./matrix.js";
import { transpose } from "./matrix.js";
import type { Vector } from "./vector.js";
import { transform } from "./vector.js";

/**
 * Converts geodetic coordinates to an n-vector.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/lat_long2n_E.m
 *
 * @param latitude - Geodetic latitude in radians.
 * @param longitude - Geodetic longitude in radians.
 * @param frame - Coordinate frame in which the n-vector is decomposed.
 *
 * @returns An n-vector.
 */
export function fromGeodeticCoordinates(
  latitude: number,
  longitude: number,
  frame: Matrix = Z_AXIS_NORTH,
): Vector {
  // Equation (3) from Gade (2010):
  const cosLat = Math.cos(latitude);

  // frame selects correct E-axes
  return transform(transpose(frame), [
    Math.sin(latitude),
    Math.sin(longitude) * cosLat,
    -Math.cos(longitude) * cosLat,
  ]);
}

/**
 * Converts an n-vector to geodetic coordinates.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/n_E2lat_long.m
 *
 * @param vector - An n-vector.
 * @param frame - Coordinate frame in which the n-vector is decomposed.
 *
 * @returns Geodetic latitude and longitude in radians.
 */
export function toGeodeticCoordinates(
  vector: Vector,
  frame: Matrix = Z_AXIS_NORTH,
): [latitude: number, longitude: number] {
  // Equation (5) in Gade (2010):
  const [x, y, z] = transform(frame, vector);
  const longitude = Math.atan2(y, -z);

  // Equation (6) in Gade (2010) (Robust numerical solution)
  // vector component in the equatorial plane
  const ec = Math.hypot(y, z);
  // atan() could also be used since latitude is within [-pi/2,pi/2]
  const latitude = Math.atan2(x, ec);

  // latitude = asin(x) is a theoretical solution, but close to the Poles it is
  // ill-conditioned which may lead to numerical inaccuracies (and it will give
  // imaginary results for norm(vector)>1)

  return [latitude, longitude];
}
