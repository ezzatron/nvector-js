/**
 * The Geodetic Reference System 1980 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L45
 */
export const GRS_80: Ellipsoid = {
  a: 6378137,
  f: 1 / 298.257222101,
} as const;

/**
 * The World Geodetic System 1972 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L47
 */
export const WGS_72: Ellipsoid = {
  a: 6378135,
  f: 1 / 298.26,
} as const;

/**
 * The World Geodetic System 1984 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L39
 */
export const WGS_84: Ellipsoid = {
  a: 6378137,
  f: 1 / 298.257223563,
} as const;

/**
 * A sphere with the same semi-major axis as the WGS-84 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L39
 */
export const WGS_84_SPHERE: Ellipsoid = {
  a: WGS_84.a,
  f: 0,
} as const;

export type Ellipsoid = {
  a: number;
  f: number;
};
