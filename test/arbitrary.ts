import { fc } from "@fast-check/vitest";
import type { Ellipsoid, Matrix, Vector } from "nvector-geodesy";
import { GRS_80, WGS_72, WGS_84 } from "nvector-geodesy";

const RADIAN = Math.PI / 180;

export function arbitrary3dRotationMatrix(): fc.Arbitrary<Matrix> {
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

export function arbitrary3dVector(
  magnitudeConstraints: fc.DoubleConstraints,
): fc.Arbitrary<Vector> {
  return fc
    .tuple(arbitrary3dUnitVector(), fc.double(magnitudeConstraints))
    .map(([[x, y, z], m]) => [x * m, y * m, z * m]);
}

export function arbitrary3dUnitVector(): fc.Arbitrary<Vector> {
  // based on https://github.com/mrdoob/three.js/blob/a2e9ee8204b67f9dca79f48cf620a34a05aa8126/src/math/Vector3.js#L695
  // https://mathworld.wolfram.com/SpherePointPicking.html

  return fc
    .tuple(
      fc.double({ min: 0, max: Math.PI * 2, noNaN: true }),
      fc.double({ min: -1, max: 1, noNaN: true }),
    )
    .map(([theta, u]) => {
      const c = Math.sqrt(1 - u * u);

      return [c * Math.cos(theta), u, c * Math.sin(theta)];
    });
}

export function arbitraryEllipsoid(): fc.Arbitrary<Ellipsoid> {
  return fc.oneof(
    fc.constant(WGS_84),
    fc.constant(GRS_80),
    fc.constant(WGS_72),
  );
}

export function arbitraryEllipsoidDepth({
  b,
}: Ellipsoid): fc.Arbitrary<number> {
  return fc.double({ min: -b, max: b, noNaN: true });
}

export function arbitraryEllipsoidECEFVector({
  a,
  b,
}: Ellipsoid): fc.Arbitrary<Vector> {
  return arbitrary3dVector({ min: a - b, max: a + b, noNaN: true });
}

export function arbitraryGeodeticCoordinates(): fc.Arbitrary<[number, number]> {
  return fc.tuple(
    fc.double({
      min: -180 * RADIAN,
      max: 180 * RADIAN,
      noNaN: true,
    }),
    fc.double({
      min: -90 * RADIAN,
      max: 90 * RADIAN,
      noNaN: true,
    }),
  );
}

function arbitraryQuaternion(): fc.Arbitrary<
  [x: number, y: number, z: number, w: number]
> {
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

export function arbitraryRadians(): fc.Arbitrary<number> {
  return fc.double({ min: -Math.PI, max: Math.PI, noNaN: true });
}
