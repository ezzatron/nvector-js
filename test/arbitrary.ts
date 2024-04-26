import { fc } from "@fast-check/jest";
import type { Matrix3x3 } from "../src/matrix.js";
import type { Vector4 } from "../src/vector.js";

const RADIAN = Math.PI / 180;

export function arbitraryLatLon(): fc.Arbitrary<[number, number]> {
  return fc.tuple(
    fc.double({
      min: -90 * RADIAN,
      max: 90 * RADIAN,
      noNaN: true,
    }),
    fc.double({
      min: -180 * RADIAN,
      max: 180 * RADIAN,
      noNaN: true,
    }),
  );
}

export function arbitraryQuaternion(): fc.Arbitrary<Vector4> {
  // based on https://github.com/mrdoob/three.js/blob/a2e9ee8204b67f9dca79f48cf620a34a05aa8126/src/math/Quaternion.js#L592
  // Ken Shoemake
  // Uniform random rotations
  // D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.

  return fc
    .tuple(
      fc.double({ min: 0, max: Math.PI * 2, noNaN: true }),
      fc.double({ min: 0, max: Math.PI * 2, noNaN: true }),
      fc.double({ min: 0, max: 1, noNaN: true }),
    )
    .map(([theta1, theta2, x0]) => {
      const r1 = Math.sqrt(1 - x0);
      const r2 = Math.sqrt(x0);

      const x = r1 * Math.sin(theta1);
      const y = r1 * Math.cos(theta1);
      const z = r2 * Math.sin(theta2);
      const w = r2 * Math.cos(theta2);

      return [x, y, z, w];
    });
}

export function arbitrary3dRotationMatrix(): fc.Arbitrary<Matrix3x3> {
  return arbitraryQuaternion().map(([x, y, z, w]) => {
    // based on https://github.com/rawify/Quaternion.js/blob/c3834673b502e64e1866dbbf13568c0be93e52cc/quaternion.js#L791
    const wx = w * x;
    const wy = w * y;
    const wz = w * z;
    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const yy = y * y;
    const yz = y * z;
    const zz = z * z;

    return [
      [1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy)],
      [2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx)],
      [2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy)],
    ];
  });
}
