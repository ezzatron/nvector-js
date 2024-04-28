import { expect, test } from "vitest";
import {
  lat_lon2n_E,
  n_E2R_EN,
  n_EA_E_and_n_EB_E2p_AB_E,
  unrotateVector3,
} from "../../../src/index.js";
import { radians } from "../../util.js";

/**
 * Example 1: A and B to delta
 *
 * Given two positions A and B. Find the exact vector from A to B in meters
 * north, east and down, and find the direction (azimuth/bearing) to B, relative
 * to north. Use WGS-84 ellipsoid.
 *
 * - Assume WGS-84 ellipsoid. The given depths are from the ellipsoid surface.
 * - Use position A to define north, east, and down directions. (Due to the
 *   curvature of Earth and different directions to the North Pole, the north,
 *   east, and down directions will change (relative to Earth) for different
 *   places. Position A must be outside the poles for the north and east
 *   directions to be defined.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_1
 */
test("Example 1", () => {
  // >>> lat_EA, lon_EA, z_EA = rad(1), rad(2), 3
  const lat_EA = radians(1);
  const lon_EA = radians(2);
  const z_EA = 3;
  // >>> lat_EB, lon_EB, z_EB = rad(4), rad(5), 6
  const lat_EB = radians(4);
  const lon_EB = radians(5);
  const z_EB = 6;

  // >>> n_EA_E = nv.lat_lon2n_E(lat_EA, lon_EA)
  const n_EA_E = lat_lon2n_E(lat_EA, lon_EA);
  // >>> n_EB_E = nv.lat_lon2n_E(lat_EB, lon_EB)
  const n_EB_E = lat_lon2n_E(lat_EB, lon_EB);

  // >>> p_AB_E = nv.n_EA_E_and_n_EB_E2p_AB_E(n_EA_E, n_EB_E, z_EA, z_EB)
  const p_AB_E = n_EA_E_and_n_EB_E2p_AB_E(n_EA_E, n_EB_E, z_EA, z_EB);

  // >>> R_EN = nv.n_E2R_EN(n_EA_E)
  const R_EN = n_E2R_EN(n_EA_E);

  // >>> p_AB_N = np.dot(R_EN.T, p_AB_E).ravel()
  const p_AB_N = unrotateVector3(R_EN, p_AB_E);
  // >>> x, y, z = p_AB_N
  const [x, y, z] = p_AB_N;
  // >>> 'Ex1: delta north, east, down = {0:8.2f}, {1:8.2f}, {2:8.2f}'.format(x, y, z)
  // 'Ex1: delta north, east, down = 331730.23, 332997.87, 17404.27'
  expect(x).toBeCloseTo(331730.23, 2);
  expect(y).toBeCloseTo(332997.87, 2);
  expect(z).toBeCloseTo(17404.27, 2);

  // >>> azimuth = np.arctan2(y, x)
  const azimuth = Math.atan2(y, x);
  // >>> 'azimuth = {0:4.2f} deg'.format(deg(azimuth))
  // 'azimuth = 45.11 deg'
  expect(azimuth).toBeCloseTo(radians(45.11), 2);

  // >>> distance = np.linalg.norm(p_AB_N)
  const distance = Math.hypot(x, y, z);
  // >>> elevation = np.arcsin(z / distance)
  const elevation = Math.asin(z / distance);
  // >>> 'elevation = {0:4.2f} deg'.format(deg(elevation))
  // 'elevation = 2.12 deg'
  expect(elevation).toBeCloseTo(radians(2.12), 2);

  // >>> 'distance = {0:4.2f} m'.format(distance)
  // 'distance = 470356.72 m'
  expect(distance).toBeCloseTo(470356.72, 2);
});
