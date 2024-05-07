# _n_-vector

_Functions for performing geographical position calculations using n-vectors_

[![Current version][badge-version-image]][badge-version-link]
[![Build status][badge-build-image]][badge-build-link]
[![Test coverage][badge-coverage-image]][badge-coverage-link]

[badge-build-image]:
  https://img.shields.io/github/actions/workflow/status/ezzatron/nvector-js/ci.yml?branch=main&style=for-the-badge
[badge-build-link]:
  https://github.com/ezzatron/nvector-js/actions/workflows/ci.yml
[badge-coverage-image]:
  https://img.shields.io/codecov/c/gh/ezzatron/nvector-js?style=for-the-badge
[badge-coverage-link]: https://codecov.io/gh/ezzatron/nvector-js
[badge-version-image]:
  https://img.shields.io/npm/v/nvector-geodesy?label=nvector-geodesy&logo=npm&style=for-the-badge
[badge-version-link]: https://npmjs.com/package/nvector-geodesy

This library is a lightweight (&lt;2kB), dependency-free port of the [Matlab
n-vector library] by [Kenneth Gade]. All original functions are included, plus
some extras for vector and matrix operations needed to solve the [10 examples
from the n-vector page].

[matlab n-vector library]: https://github.com/FFI-no/n-vector
[kenneth gade]: https://github.com/KennethGade
[10 examples from the n-vector page]: https://www.ffi.no/en/research/n-vector

See the [reference documentation] for a list of all functions and their
signatures.

[reference documentation]: https://ezzatron.com/nvector-js

## Installation

```sh
npm install nvector-geodesy
```

## Examples

The following sections show the [10 examples from the n-vector page] implemented
using this library.

### Example 1

> Given two positions _A_ and _B_. Find the exact vector from _A_ to _B_ in
> meters north, east and down, and find the direction (azimuth/bearing) to _B_,
> relative to north. Use WGS-84 ellipsoid.
>
> https://www.ffi.no/en/research/n-vector/#example_1

```ts
import {
  lat_long2n_E,
  n_E2R_EN,
  n_EA_E_and_n_EB_E2p_AB_E,
  rad,
  rotate,
  transpose,
} from "nvector-geodesy";

// Positions A and B are given in (decimal) degrees and depths:

// Position A:
const lat_EA_deg = 1;
const long_EA_deg = 2;
const z_EA = 3;

// Position B:
const lat_EB_deg = 4;
const long_EB_deg = 5;
const z_EB = 6;

// Find the exact vector between the two positions, given in meters north,
// east, and down, i.e. find p_AB_N.

// SOLUTION:

// Step1: Convert to n-vectors (rad() converts to radians):
const n_EA_E = lat_long2n_E(rad(lat_EA_deg), rad(long_EA_deg));
const n_EB_E = lat_long2n_E(rad(lat_EB_deg), rad(long_EB_deg));

// Step2: Find p_AB_E (delta decomposed in E). WGS-84 ellipsoid is default:
const p_AB_E = n_EA_E_and_n_EB_E2p_AB_E(n_EA_E, n_EB_E, z_EA, z_EB);

// Step3: Find R_EN for position A:
const R_EN = n_E2R_EN(n_EA_E);

// Step4: Find p_AB_N
const p_AB_N = rotate(transpose(R_EN), p_AB_E);
// (Note the transpose of R_EN: The "closest-rule" says that when decomposing,
// the frame in the subscript of the rotation matrix that is closest to the
// vector, should equal the frame where the vector is decomposed. Thus the
// calculation R_NE*p_AB_E is correct, since the vector is decomposed in E,
// and E is closest to the vector. In the above example we only had R_EN, and
// thus we must transpose it: R_EN' = R_NE)

// Step5: Also find the direction (azimuth) to B, relative to north:
const azimuth = Math.atan2(p_AB_N[1], p_AB_N[0]);
```

## References

- Gade, K. (2010). [A Non-singular Horizontal Position Representation], The
  Journal of Navigation, Volume 63, Issue 03, pp 395-417, July 2010.
- [The n-vector page]
- Ellipsoid data taken from [chrisveness/geodesy]

[a non-singular horizontal position representation]:
  https://www.navlab.net/Publications/A_Nonsingular_Horizontal_Position_Representation.pdf
[the n-vector page]: https://www.ffi.no/en/research/n-vector
[chrisveness/geodesy]: https://github.com/chrisveness/geodesy
