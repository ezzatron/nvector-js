import { expect, test } from "vitest";
import { WGS_72 } from "../../../src/ellipsoid.js";
import {
  deg,
  multiplyMatrix3x3,
  n_E2R_EN,
  n_E2lat_lon,
  n_EA_E_and_p_AB_E2n_EB_E,
  rad,
  rotateVector3,
  unitVector3,
  zyx2R,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 2: B and delta to C
 *
 * Given the position of vehicle B and a bearing and distance to an object C.
 * Find the exact position of C. Use WGS-72 ellipsoid.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_2
 */
test("Example 2", () => {
  // Step 1: Position and orientation of B is 400m above E:
  // >>> n_EB_E = nv.unit([[1], [2], [3]])  # unit to get unit length of vector
  const n_EB_E = unitVector3([1, 2, 3]);
  // >>> z_EB = -400
  const z_EB = -400;
  // >>> yaw, pitch, roll = rad(10), rad(20), rad(30)
  const yaw = rad(10);
  const pitch = rad(20);
  const roll = rad(30);
  // >>> R_NB = nv.zyx2R(yaw, pitch, roll)
  const R_NB = zyx2R(yaw, pitch, roll);

  // Step 2: Delta BC decomposed in B
  // >>> p_BC_B = np.r_[3000, 2000, 100].reshape((-1, 1))
  const p_BC_B: Vector3 = [3000, 2000, 100];

  // Step 3: Find R_EN:
  // >>> R_EN = nv.n_E2R_EN(n_EB_E)
  const R_EN = n_E2R_EN(n_EB_E);

  // Step 4: Find R_EB, from R_EN and R_NB:
  // >>> R_EB = np.dot(R_EN, R_NB)  # Note: closest frames cancel
  const R_EB = multiplyMatrix3x3(R_EN, R_NB);

  // Step 5: Decompose the delta BC vector in E:
  // >>> p_BC_E = np.dot(R_EB, p_BC_B)
  const p_BC_E = rotateVector3(R_EB, p_BC_B);

  // Step 6: Find the position of C, using the functions that goes from one
  // >>> n_EC_E, z_EC = nv.n_EA_E_and_p_AB_E2n_EB_E(n_EB_E, p_BC_E, z_EB, **wgs72)
  const [n_EC_E, z_EC] = n_EA_E_and_p_AB_E2n_EB_E(
    n_EB_E,
    p_BC_E,
    z_EB,
    WGS_72.a,
    WGS_72.f,
  );

  // >>> lat_EC, lon_EC = nv.n_E2lat_lon(n_EC_E)
  const [lat_EC, lon_EC] = n_E2lat_lon(n_EC_E);
  // >>> lat, lon, z = deg(lat_EC), deg(lon_EC), z_EC
  const lat = deg(lat_EC);
  const lon = deg(lon_EC);
  const z = z_EC;
  // >>> msg = 'Ex2: PosC: lat, lon = {:4.2f}, {:4.2f} deg,  height = {:4.2f} m'
  // >>> msg.format(lat[0], lon[0], -z[0])
  // 'Ex2: PosC: lat, lon = 53.33, 63.47 deg,  height = 406.01 m'
  expect(lat).toBeCloseTo(53.33, 2);
  expect(lon).toBeCloseTo(63.47, 2);
  expect(-z).toBeCloseTo(406.01, 2);
});
