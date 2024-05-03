import { it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { R_EN2n_E } from "../../src/index.js";
import { arbitrary3dRotationMatrix } from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("R_EN2n_E()", () => {
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
    async (R_EN) => {
      const expected = await nvectorTestClient.R_EN2n_E(R_EN);

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = R_EN2n_E(R_EN);

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
