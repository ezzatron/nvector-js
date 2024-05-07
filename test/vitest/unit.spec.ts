import { it } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { unit } from "../../src/index.js";

describe("unit()", () => {
  it("returns a chosen vector when norm is 0", () => {
    expect(unit([0, 0, 0])).toEqual([1, 0, 0]);
  });
});
