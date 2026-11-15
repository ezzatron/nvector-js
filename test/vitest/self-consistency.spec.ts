import {
  WGS_84,
  fromECEF,
  fromRotationMatrix,
  multiply,
  normalize,
  toECEF,
  toRotationMatrix,
  transpose,
  type Vector,
} from "nvector-geodesy";
import { describe, expect, it } from "vitest";

describe("toECEF()", () => {
  it.each`
    label             | n             | want
    ${"equator"}      | ${[1, 0, 0]}  | ${[WGS_84.a, 0, 0]}
    ${"east equator"} | ${[0, 1, 0]}  | ${[0, WGS_84.a, 0]}
    ${"north pole"}   | ${[0, 0, 1]}  | ${[0, 0, WGS_84.b]}
    ${"south pole"}   | ${[0, 0, -1]} | ${[0, 0, -WGS_84.b]}
  `(
    "returns known ECEF positions at the $label",
    ({ n, want }: { n: Vector; want: Vector }) => {
      const actual = toECEF(n, 0, WGS_84);

      expect(actual[0]).toBeCloseTo(want[0], 6);
      expect(actual[1]).toBeCloseTo(want[1], 6);
      expect(actual[2]).toBeCloseTo(want[2], 6);
    },
  );

  it.each`
    label                             | n             | depth
    ${"equator"}                      | ${[1, 0, 0]}  | ${0}
    ${"east equator"}                 | ${[0, 1, 0]}  | ${0}
    ${"north pole"}                   | ${[0, 0, 1]}  | ${0}
    ${"south pole"}                   | ${[0, 0, -1]} | ${0}
    ${"north pole at depth"}          | ${[0, 0, 1]}  | ${1000}
    ${"north pole above the surface"} | ${[0, 0, 1]}  | ${-10000}
  `(
    "round-trips through fromECEF() at the $label",
    ({ n, depth }: { n: Vector; depth: number }) => {
      const [actualN, actualDepth] = fromECEF(toECEF(n, depth, WGS_84), WGS_84);

      expect(actualN[0]).toBeCloseTo(n[0], 14);
      expect(actualN[1]).toBeCloseTo(n[1], 14);
      expect(actualN[2]).toBeCloseTo(n[2], 14);
      expect(actualDepth).toBeCloseTo(depth, 6);
    },
  );
});

describe("fromECEF()", () => {
  it.each`
    label                 | p
    ${"x is zero"}        | ${[0, 3e6, -3e6]}
    ${"y plus z is zero"} | ${[WGS_84.a, 3e3, -3e3]}
  `("round-trips through toECEF() when $label", ({ p }: { p: Vector }) => {
    const [n, depth] = fromECEF(p, WGS_84);
    const actual = toECEF(n, depth, WGS_84);

    expect(actual[0]).toBeCloseTo(p[0], 6);
    expect(actual[1]).toBeCloseTo(p[1], 6);
    expect(actual[2]).toBeCloseTo(p[2], 6);
  });
});

describe("toRotationMatrix()", () => {
  it("returns an orthonormal matrix for a near-pole n-vector", () => {
    const n = normalize([1e-12, 0, 1]);
    const r = toRotationMatrix(n);

    expect(multiply(transpose(r), r)).toEqual([
      [expect.closeTo(1, 14), expect.closeTo(0, 14), expect.closeTo(0, 14)],
      [expect.closeTo(0, 14), expect.closeTo(1, 14), expect.closeTo(0, 14)],
      [expect.closeTo(0, 14), expect.closeTo(0, 14), expect.closeTo(1, 14)],
    ]);
    expect(fromRotationMatrix(r)).toEqual([
      expect.closeTo(n[0], 14),
      expect.closeTo(n[1], 14),
      expect.closeTo(n[2], 14),
    ]);
  });
});
