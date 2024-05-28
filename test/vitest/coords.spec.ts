import { fc, it } from "@fast-check/vitest";
import {
  fromGeodeticCoordinates,
  toGeodeticCoordinates,
} from "nvector-geodesy";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryLatLon,
} from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 1000;

describe("fromGeodeticCoordinates()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      arbitraryLatLon(),
      fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async ([latitude, longitude], frame) => {
      const expected = await nvectorTestClient.fromGeodeticCoordinates(
        latitude,
        longitude,
        frame,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = fromGeodeticCoordinates(latitude, longitude, frame);

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

describe("toGeodeticCoordinates()", () => {
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
      fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async (vector, frame) => {
      const expected = await nvectorTestClient.toGeodeticCoordinates(
        vector,
        frame,
      );

      expect(expected).toMatchObject([expect.any(Number), expect.any(Number)]);

      const actual = toGeodeticCoordinates(vector, frame);

      expect(actual).toMatchObject([expect.any(Number), expect.any(Number)]);
      expect(actual[0]).toBeCloseTo(expected[0], 15);
      expect(actual[1]).toBeCloseTo(expected[1], 15);
    },
    TEST_DURATION + 1000,
  );
});
