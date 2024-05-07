# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

## Unreleased

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
