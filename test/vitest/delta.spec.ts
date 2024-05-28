import { fc, it } from "@fast-check/vitest";
import {
  WGS_84,
  Z_AXIS_NORTH,
  delta,
  destination,
  toECEF,
  transform,
  type Vector,
} from "nvector-geodesy";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryEllipsoid,
  arbitraryEllipsoidDepth,
  arbitraryEllipsoidECEFVector,
} from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("delta()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      arbitrary3dUnitVector(),
      arbitrary3dUnitVector(),
      arbitraryEllipsoid().chain((ellipsoid) => {
        return fc.tuple(
          fc.option(arbitraryEllipsoidDepth(ellipsoid), {
            nil: undefined,
          }),
          fc.option(arbitraryEllipsoidDepth(ellipsoid), {
            nil: undefined,
          }),
          fc.option(fc.constant(ellipsoid), { nil: undefined }),
        );
      }),
      fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async (from, to, [fromDepth, toDepth, ellipsoid], frame) => {
      const expected = await nvectorTestClient.delta(
        from,
        to,
        fromDepth,
        toDepth,
        ellipsoid,
        frame,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = delta(from, to, fromDepth, toDepth, ellipsoid, frame);

      expect(actual).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actual[0]).toBeCloseTo(expected[0], 7);
      expect(actual[1]).toBeCloseTo(expected[1], 7);
      expect(actual[2]).toBeCloseTo(expected[2], 7);
    },
    TEST_DURATION + 1000,
  );
});

describe("destination()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      arbitraryEllipsoid()
        .chain((ellipsoid) => {
          return fc.tuple(
            arbitrary3dUnitVector(),
            arbitraryEllipsoidECEFVector(ellipsoid),
            fc.option(arbitraryEllipsoidDepth(ellipsoid), { nil: undefined }),
            fc.option(fc.constant(ellipsoid), { nil: undefined }),
            fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
          );
        })
        .filter(
          ([
            from,
            delta,
            fromDepth,
            ellipsoid = WGS_84,
            frame = Z_AXIS_NORTH,
          ]) => {
            const { a, f } = ellipsoid;
            const [ax, ay, az] = toECEF(from, fromDepth, ellipsoid, frame);
            const b: Vector = [ax + delta[0], ay + delta[1], az + delta[2]];
            const [bx, by, bz] = transform(frame, b);

            // filter vectors where the x or yz components are zero after
            // rotation
            // this causes a division by zero in the Python implementation
            if (bx === 0 || by + bz === 0) return false;

            // filter a case that makes the Python implementation try to find
            // the square root of a negative number
            // not sure why this happens, the math is beyond me
            const s = (() => {
              const e2 = (2.0 - f) * f;
              const R2 = b[1] ** 2 + b[2] ** 2;
              const p = R2 / a ** 2;
              const q = ((1 - e2) / a ** 2) * b[0] ** 2;
              const r = (p + q - e2 ** 2) / 6;

              return (e2 ** 2 * p * q) / (4 * r ** 3);
            })();
            if (Number.isNaN(s) || s <= 0) return false;

            return true;
          },
        ),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async ([from, delta, fromDepth, ellipsoid, frame]) => {
      const [expectedVector, expectedDepth] =
        await nvectorTestClient.destination(
          from,
          delta,
          fromDepth,
          ellipsoid,
          frame,
        );

      expect(expectedVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(expectedDepth).toEqual(expect.any(Number));

      const [actualVector, actualDepth] = destination(
        from,
        delta,
        fromDepth,
        ellipsoid,
        frame,
      );

      expect(actualVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actualVector[0]).toBeCloseTo(expectedVector[0], 12);
      expect(actualVector[1]).toBeCloseTo(expectedVector[1], 12);
      expect(actualVector[2]).toBeCloseTo(expectedVector[2], 12);
      expect(actualDepth).toBeCloseTo(expectedDepth, 7);
    },
    TEST_DURATION + 1000,
  );
});
