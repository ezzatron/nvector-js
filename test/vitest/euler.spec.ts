import { it } from "@fast-check/vitest";
import {
  eulerXYZToRotationMatrix,
  eulerZYXToRotationMatrix,
  rotationMatrixToEulerXYZ,
  rotationMatrixToEulerZYX,
} from "nvector-geodesy";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { arbitrary3dRotationMatrix, arbitraryRadians } from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";
import { angleDelta } from "../util.js";

const TEST_DURATION = 1000;

describe("eulerXYZToRotationMatrix()", () => {
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
    "matches the reference implementation",
    async (x, y, z) => {
      const expected = await nvectorTestClient.eulerXYZToRotationMatrix(
        x,
        y,
        z,
      );

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = eulerXYZToRotationMatrix(x, y, z);

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

describe("eulerZYXToRotationMatrix()", () => {
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
    "matches the reference implementation",
    async (z, y, x) => {
      const expected = await nvectorTestClient.eulerZYXToRotationMatrix(
        z,
        y,
        x,
      );

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = eulerZYXToRotationMatrix(z, y, x);

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

describe("rotationMatrixToEulerXYZ()", () => {
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
      const expected =
        await nvectorTestClient.rotationMatrixToEulerXYZ(rotation);

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = rotationMatrixToEulerXYZ(rotation);

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

  it("handles Euler angle singularity", () => {
    expect(
      rotationMatrixToEulerXYZ([
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ]),
    ).toMatchObject([0, Math.PI / 2, 0]);
  });
});

describe("rotationMatrixToEulerZYX()", () => {
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
      const expected =
        await nvectorTestClient.rotationMatrixToEulerZYX(rotation);

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = rotationMatrixToEulerZYX(rotation);

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

  it("handles Euler angle singularity", () => {
    expect(
      rotationMatrixToEulerZYX([
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ]),
    ).toMatchObject([-0, Math.PI / 2, 0]);
  });
});
