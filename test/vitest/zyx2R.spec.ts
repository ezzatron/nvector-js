import { it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { zyx2R } from "../../src/index.js";
import { arbitraryRadians } from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("zyx2R()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop([arbitraryRadians(), arbitraryRadians(), arbitraryRadians()], {
    interruptAfterTimeLimit: TEST_DURATION,
    numRuns: Infinity,
  })(
    "matches the Python implementation",
    async (z, y, x) => {
      const expected = await nvectorTestClient.zyx2R(z, y, x);

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = zyx2R(z, y, x);

      expect(actual).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);
      expect(actual[0][0]).toBeCloseTo(expected[0][0], 15);
      expect(actual[0][1]).toBeCloseTo(expected[0][1], 15);
      expect(actual[0][2]).toBeCloseTo(expected[0][2], 15);
      expect(actual[1][0]).toBeCloseTo(expected[1][0], 15);
      expect(actual[1][1]).toBeCloseTo(expected[1][1], 15);
      expect(actual[1][2]).toBeCloseTo(expected[1][2], 15);
      expect(actual[2][0]).toBeCloseTo(expected[2][0], 15);
      expect(actual[2][1]).toBeCloseTo(expected[2][1], 15);
      expect(actual[2][2]).toBeCloseTo(expected[2][2], 15);
    },
    TEST_DURATION + 1000,
  );
});
