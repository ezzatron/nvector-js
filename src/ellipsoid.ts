/**
 * Values from https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L38
 */

export type Ellipsoid = {
  a: number;
  f: number;
};

export const GRS_80: Ellipsoid = {
  a: 6378137,
  f: 1 / 298.257222101,
} as const;

export const WGS_72: Ellipsoid = {
  a: 6378135,
  f: 1 / 298.26,
} as const;

export const WGS_84: Ellipsoid = {
  a: 6378137,
  f: 1 / 298.257223563,
} as const;

export const WGS_84_SPHERE: Ellipsoid = {
  a: WGS_84.a,
  f: 0,
} as const;
