import { it } from "@fast-check/jest";
import { lat_lon2n_E, n_E2lat_lon } from "../../src/index.js";
import { arbitraryLatLon } from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

describe("n_E2lat_lon()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop([arbitraryLatLon()], {
    numRuns: Infinity,
  })("matches the Python implementation", async ([latitude, longitude]) => {
    const [x, y, z] = lat_lon2n_E(latitude, longitude);

    const expected = await nvectorTestClient.n_E2lat_lon(x, y, z);

    expect(expected).toMatchObject([expect.any(Number), expect.any(Number)]);

    const actual = n_E2lat_lon(x, y, z);

    expect(actual).toMatchObject([expect.any(Number), expect.any(Number)]);
    expect(actual[0]).toBeCloseTo(expected[0], 10);
    expect(actual[1]).toBeCloseTo(expected[1], 10);
  });
});
