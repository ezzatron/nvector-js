/**
 * The Geodetic Reference System 1980 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L45
 */
export const GRS_80: Ellipsoid = {
  a: 6378137,
  b: 6356752.314140356,
  f: 1 / 298.257222101,
} as const;

/**
 * The World Geodetic System 1972 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L47
 */
export const WGS_72: Ellipsoid = {
  a: 6378135,
  b: 6356750.520016094,
  f: 1 / 298.26,
} as const;

/**
 * The World Geodetic System 1984 ellipsoid.
 *
 * @see https://github.com/chrisveness/geodesy/blob/761587cd748bd9f7c9825195eba4a9fc5891b859/latlon-ellipsoidal-datum.js#L39
 */
export const WGS_84: Ellipsoid = {
  a: 6378137,
  b: 6356752.314245179,
  f: 1 / 298.257223563,
} as const;

/**
 * Create a spherical ellipsoid with the given radius.
 *
 * @param radius - A radius in meters.
 *
 * @returns A spherical ellipsoid.
 */
export function sphere(radius: number): Ellipsoid {
  return {
    a: radius,
    b: radius,
    f: 0,
  };
}

/**
 * An ellipsoid.
 */
export type Ellipsoid = {
  /**
   * The semi-major axis of the ellipsoid in meters.
   */
  a: number;

  /**
   * The semi-minor axis of the ellipsoid in meters.
   */
  b: number;

  /**
   * The flattening of the ellipsoid.
   */
  f: number;
};
