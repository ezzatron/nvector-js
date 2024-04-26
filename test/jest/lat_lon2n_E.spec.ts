import { fc, it } from "@fast-check/jest";
import { lat_lon2n_E } from "../../src/index.js";
import { arbitrary3dRotationMatrix, arbitraryLatLon } from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

describe("lat_lon2n_E()", () => {
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
    { numRuns: Infinity },
  )(
    "matches the Python implementation",
    async ([latitude, longitude], R_Ee) => {
      const expected = await nvectorTestClient.lat_lon2n_E(
        latitude,
        longitude,
        R_Ee,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = lat_lon2n_E(latitude, longitude, R_Ee);

      expect(actual).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actual[0]).toBeCloseTo(expected[0], 10);
      expect(actual[1]).toBeCloseTo(expected[1], 10);
      expect(actual[2]).toBeCloseTo(expected[2], 10);
    },
  );
});
