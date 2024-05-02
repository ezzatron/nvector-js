import { it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { R2zyx } from "../../src/index.js";
import { arbitrary3dRotationMatrix } from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";
import { angleDelta } from "../util.js";

const TEST_DURATION = 5000;

describe("R2zyx()", () => {
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
    "matches the Python implementation",
    async (R_AB) => {
      const expected = await nvectorTestClient.R2zyx(R_AB);

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = R2zyx(R_AB);

      expect(actual).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(angleDelta(actual[0], expected[0])).toBeCloseTo(0, 15);
      expect(angleDelta(actual[1], expected[1])).toBeCloseTo(0, 15);
      expect(angleDelta(actual[2], expected[2])).toBeCloseTo(0, 15);
    },
    TEST_DURATION + 1000,
  );
});
