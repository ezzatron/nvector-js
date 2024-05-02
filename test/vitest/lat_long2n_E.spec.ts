import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { lat_long2n_E } from "../../src/index.js";
import { arbitrary3dRotationMatrix, arbitraryLatLon } from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("lat_long2n_E()", () => {
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
    async ([latitude, longitude], R_Ee) => {
      const expected = await nvectorTestClient.lat_long2n_E(
        latitude,
        longitude,
        R_Ee,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = lat_long2n_E(latitude, longitude, R_Ee);

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
