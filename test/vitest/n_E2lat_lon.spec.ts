import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { n_E2lat_lon } from "../../src/index.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
} from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_E2lat_lon()", () => {
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
    "matches the Python implementation",
    async (n_E, R_Ee) => {
      const expected = await nvectorTestClient.n_E2lat_lon(n_E, R_Ee);

      expect(expected).toMatchObject([expect.any(Number), expect.any(Number)]);

      const actual = n_E2lat_lon(n_E, R_Ee);

      expect(actual).toMatchObject([expect.any(Number), expect.any(Number)]);
      expect(actual[0]).toBeCloseTo(expected[0], 15);
      expect(actual[1]).toBeCloseTo(expected[1], 15);
    },
    TEST_DURATION + 1000,
  );
});
