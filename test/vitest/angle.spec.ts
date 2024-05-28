import { it } from "@fast-check/vitest";
import { degrees, radians } from "nvector-geodesy";
import { describe, expect } from "vitest";

describe("degrees()", () => {
  it("converts angle in radians to degrees", () => {
    expect(degrees(1)).toBeCloseTo(57.29577951308232, 15);
  });
});

describe("radians()", () => {
  it("converts angle in degrees to radians", () => {
    expect(radians(57.29577951308232)).toBeCloseTo(1, 15);
  });
});
