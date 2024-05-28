import { it } from "@fast-check/vitest";
import { GRS_80, WGS_72, WGS_84, sphere } from "nvector-geodesy";
import { describe, expect } from "vitest";

describe("GRS_80", () => {
  it("has the correct semi-minor axis", () => {
    expect(GRS_80.b).toEqual(GRS_80.a * (1 - GRS_80.f));
  });
});

describe("WGS_72", () => {
  it("has the correct semi-minor axis", () => {
    expect(WGS_72.b).toEqual(WGS_72.a * (1 - WGS_72.f));
  });
});

describe("WGS_84", () => {
  it("has the correct semi-minor axis", () => {
    expect(WGS_84.b).toEqual(WGS_84.a * (1 - WGS_84.f));
  });
});

describe("sphere", () => {
  it("produces a sphere with the given radius", () => {
    const radius = 6371e3;
    const ellipsoid = sphere(radius);

    expect(ellipsoid.a).toEqual(radius);
    expect(ellipsoid.b).toEqual(radius);
    expect(ellipsoid.f).toEqual(0);
  });
});
