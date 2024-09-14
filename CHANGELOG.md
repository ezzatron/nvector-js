# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

## Unreleased

## [v0.6.6] - 2024-09-14

[v0.6.6]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.6

### Fixed

- Checking that releases are still possible with the new `repository` field in
  `package.json`.

## [v0.6.5] - 2024-06-11

[v0.6.5]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.5

### Fixed

- Updated the `package.json` `repository` property so that NPM provenance will
  hopefully STFU and work.

## [v0.6.4] - 2024-06-11

[v0.6.4]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.4

### Fixed

- Added NPM provenance.

## [v0.6.3] - 2024-06-11

[v0.6.3]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.3

### Fixed

- Added --allow-dirty to JSR publishing command because it doesn't like that the
  version number is set as part of the publishing workflow.

## [v0.6.2] - 2024-06-11

[v0.6.2]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.2

### Fixed

- Excluded unnecessary files from the JSR published package.
- Restricted the Prettier version to avoid
  https://github.com/prettier/prettier/issues/16351

## [v0.6.1] - 2024-06-11

[v0.6.1]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.1

### Fixed

- Published to JSR.

## [v0.6.0] - 2024-05-31

[v0.6.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.6.0

### Changed

- **\[BREAKING\]** Geodetic coordinates are now accepted and returned in
  longitude, latitude order instead of latitude, longitude order. This change
  brings the library in line with GeoJSON, Turf.js, and Mapbox. It's also more
  intuitive for most users, since the longitude can be thought of as the
  x-coordinate and the latitude as the y-coordinate. The following functions are
  affected:
  - `fromGeodeticCoordinates`
  - `toGeodeticCoordinates`

## [v0.5.0] - 2024-05-28

[v0.5.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.5.0

### Added

- Added a `sphere` function for creating spherical ellipsoids.

### Changed

- **\[BREAKING\]** All exports have been renamed to clarify their purpose:
  - `deg` -> `degrees`
  - `lat_long2n_E` -> `fromGeodeticCoordinates`
  - `Matrix3x3` -> `Matrix`
  - `n_E_and_wa2R_EL` -> `toRotationMatrixUsingWanderAzimuth`
  - `n_E2lat_long` -> `toGeodeticCoordinates`
  - `n_E2R_EN` -> `toRotationMatrix`
  - `n_EA_E_and_n_EB_E2p_AB_E` -> `delta`
  - `n_EA_E_and_p_AB_E2n_EB_E` -> `destination`
  - `n_EB_E2p_EB_E` -> `toECEF`
  - `p_EB_E2n_EB_E` -> `fromECEF`
  - `R_Ee_NP_X` -> `X_AXIS_NORTH`
  - `R_Ee_NP_Z` -> `Z_AXIS_NORTH`
  - `R_EL2n_E` -> `fromRotationMatrix`
  - `R_EN2n_E` -> `fromRotationMatrix`
  - `R2xyz` -> `rotationMatrixToEulerXYZ`
  - `R2zyx` -> `rotationMatrixToEulerZYX`
  - `rad` -> `radians`
  - `rotate` -> `transform`
  - `unit` -> `normalize`
  - `Vector3` -> `Vector`
  - `xyz2R` -> `eulerXYZToRotationMatrix`
  - `zyx2R` -> `eulerZYXToRotationMatrix`

### Removed

- **\[BREAKING\]** The `WGS_84_SPHERE` constant has been removed. Use the
  `sphere` function with your chosen radius instead.

## [v0.4.1] - 2024-05-08

[v0.4.1]: https://github.com/ezzatron/nvector-js/releases/tag/v0.4.1

### Fixed

- Expanded README documentation.

## [v0.4.0] - 2024-05-08

[v0.4.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.4.0

### Added

- Added `n_E_and_wa2R_EL` function.
- Added `R_EL2n_E` and `R_EN2n_E` functions.
- Added `R2xyz`, `R2zyx`, `xyz2R`, and `zyx2R` functions.
- Added `deg` and `rad` functions.
- Added `apply`, `cross`, `dot`, `norm`, and `unit` functions.
- Added `multiply` and `transpose` functions.
- Added `R_Ee_NP_X` and `R_Ee_NP_Z` rotation matrix constants.
- Added `GRS_80`, `WGS_72`, `WGS_84`, and `WGS_84_SPHERE` ellipsoid constants.
- Added `Ellipsoid`, `Matrix3x3`, and `Vector3` types.

### Changed

- Renamed `lat_lon2n_E` function to `lat_long2n_E`.
- Renamed `n_E2lat_lon` function to `n_E2lat_long`.
- Renamed `rotateVector3` function to `rotate`.

### Removed

- Removed `unrotateVector3` function.
- Removed `sub` function.

## [v0.3.0] - 2024-04-28

[v0.3.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.3.0

### Added

- Added the `n_E2R_EN` function.
- Added the `n_EA_E_and_n_EB_E2p_AB_E` function.
- Added the `n_EA_E_and_p_AB_E2n_EB_E` function.
- Added the `n_EB_E2p_EB_E` function.
- Added the `p_EB_E2n_EB_E` function.
- Added the `rotateVector3` function.
- Added the `unrotateVector3` function.

## [v0.2.0] - 2024-04-26

[v0.2.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.2.0

### Added

- Added `R_Ee` rotation matrix support to the `lat_lon2n_E` and `n_E2lat_lon`
  functions.

### Changed

- The `n_E2lat_lon` function now accepts an `n_E` vector instead of individual
  `x`, `y`, and `z` arguments.

## [v0.1.2] - 2023-09-30

[v0.1.2]: https://github.com/ezzatron/nvector-js/releases/tag/v0.1.2

### Changed

- Renamed package to avoid confusion with the existing `n-vector` package.

## [v0.1.1] - 2023-09-30

[v0.1.1]: https://github.com/ezzatron/nvector-js/releases/tag/v0.1.1

### Fixed

- Fixed package publishing workflow.

## [v0.1.0] - 2023-09-30

[v0.1.0]: https://github.com/ezzatron/nvector-js/releases/tag/v0.1.0

### Added

- Initial release.
