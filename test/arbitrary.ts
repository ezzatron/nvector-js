import { fc } from "@fast-check/jest";

const RADIAN = Math.PI / 180;

export function arbitraryLat(): fc.Arbitrary<number> {
  return fc.double({
    min: -90 * RADIAN,
    max: 90 * RADIAN,
    noNaN: true,
  });
}

export function arbitraryLon(): fc.Arbitrary<number> {
  return fc.double({
    min: -180 * RADIAN,
    max: 180 * RADIAN,
    noNaN: true,
  });
}

export function arbitraryLatLon(): fc.Arbitrary<[number, number]> {
  return fc.tuple(arbitraryLat(), arbitraryLon());
}
