import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { n_EB_E2p_EB_E } from "../../src/index.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryEllipsoid,
  arbitraryEllipsoidDepth,
} from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_EB_E2p_EB_E()", () => {
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
      arbitraryEllipsoid().chain((ellipsoid) => {
        return fc.tuple(
          fc.option(arbitraryEllipsoidDepth(ellipsoid), { nil: undefined }),
          fc.option(fc.constant(ellipsoid.a), { nil: undefined }),
          fc.option(fc.constant(ellipsoid.f), { nil: undefined }),
        );
      }),
      fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async (n_EB_E, [depth, a, f], R_Ee) => {
      const expected = await nvectorTestClient.n_EB_E2p_EB_E(
        n_EB_E,
        depth,
        a,
        f,
        R_Ee,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = n_EB_E2p_EB_E(n_EB_E, depth, a, f, R_Ee);

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
