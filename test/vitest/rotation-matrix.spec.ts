import { fc, it } from "@fast-check/vitest";
import {
  Z_AXIS_NORTH,
  eulerXYZToRotationMatrix,
  fromRotationMatrix,
  toGeodeticCoordinates,
  toRotationMatrix,
  toRotationMatrixUsingWanderAzimuth,
  transform,
} from "nvector-geodesy";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryRadians,
} from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 1000;

describe("fromRotationMatrix()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop([arbitrary3dRotationMatrix()], {
    interruptAfterTimeLimit: TEST_DURATION,
    numRuns: Infinity,
  })(
    "matches the reference implementation",
    async (rotation) => {
      const expected = await nvectorTestClient.fromRotationMatrix(rotation);

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = fromRotationMatrix(rotation);

      expect(actual).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actual[0]).toBeCloseTo(expected[0], 15);
      expect(actual[1]).toBeCloseTo(expected[1], 15);
      expect(actual[2]).toBeCloseTo(expected[2], 15);
    },
    TEST_DURATION + 1000,
  );
});

describe("toRotationMatrix()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      fc
        .tuple(
          arbitrary3dUnitVector(),
          fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
        )
        .filter(([vector, frame = Z_AXIS_NORTH]) => {
          // Avoid situations where very close to poles
          // Python implementation rounds to zero in these cases, which causes
          // the Y axis to be [0, 1, 0] instead of the calculated value,
          // producing very different results.
          const [, y, z] = transform(frame, vector);
          const yDirNorm = Math.hypot(-z, y);
          if (yDirNorm > 0 && yDirNorm <= 1e-100) {
            return false;
          }

          return true;
        }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async ([vector, rotation]) => {
      const expected = await nvectorTestClient.toRotationMatrix(
        vector,
        rotation,
      );

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = toRotationMatrix(vector, rotation);

      expect(actual).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);
      expect(actual[0][0]).toBeCloseTo(expected[0][0], 14);
      expect(actual[0][1]).toBeCloseTo(expected[0][1], 14);
      expect(actual[0][2]).toBeCloseTo(expected[0][2], 14);
      expect(actual[1][0]).toBeCloseTo(expected[1][0], 14);
      expect(actual[1][1]).toBeCloseTo(expected[1][1], 14);
      expect(actual[1][2]).toBeCloseTo(expected[1][2], 14);
      expect(actual[2][0]).toBeCloseTo(expected[2][0], 14);
      expect(actual[2][1]).toBeCloseTo(expected[2][1], 14);
      expect(actual[2][2]).toBeCloseTo(expected[2][2], 14);
    },
    TEST_DURATION + 1000,
  );

  it("handles the poles", () => {
    expect(toRotationMatrix([0, 0, 1])).toMatchObject([
      [-1, 0, 0],
      [0, 1, -0],
      [0, 0, -1],
    ]);
  });
});

describe("toRotationMatrixUsingWanderAzimuth()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      fc
        .tuple(
          arbitrary3dUnitVector(),
          arbitraryRadians(),
          fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
        )
        .filter(([vector, wanderAzimuth, frame = Z_AXIS_NORTH]) => {
          // Avoid situations where components of the xyz2R matrix are close
          // to zero. The Python implementation rounds to zero in these cases,
          // which produces very different results.
          const [latitude, longitude] = toGeodeticCoordinates(vector, frame);
          const rotation = eulerXYZToRotationMatrix(
            longitude,
            -latitude,
            wanderAzimuth,
          );
          if (
            rotation.some((row) =>
              row.some(
                (value) => value !== 0 && value < 1e-15 && value > -1e-15,
              ),
            )
          ) {
            return false;
          }

          return true;
        }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async ([vector, wanderAzimuth, frame]) => {
      const expected =
        await nvectorTestClient.toRotationMatrixUsingWanderAzimuth(
          vector,
          wanderAzimuth,
          frame,
        );

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = toRotationMatrixUsingWanderAzimuth(
        vector,
        wanderAzimuth,
        frame,
      );

      expect(actual).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);
      expect(actual[0][0]).toBeCloseTo(expected[0][0], 14);
      expect(actual[0][1]).toBeCloseTo(expected[0][1], 14);
      expect(actual[0][2]).toBeCloseTo(expected[0][2], 14);
      expect(actual[1][0]).toBeCloseTo(expected[1][0], 14);
      expect(actual[1][1]).toBeCloseTo(expected[1][1], 14);
      expect(actual[1][2]).toBeCloseTo(expected[1][2], 14);
      expect(actual[2][0]).toBeCloseTo(expected[2][0], 14);
      expect(actual[2][1]).toBeCloseTo(expected[2][1], 14);
      expect(actual[2][2]).toBeCloseTo(expected[2][2], 14);
    },
    TEST_DURATION + 1000,
  );
});
