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

### Example 1: A and B to delta

![Illustration of example 1](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-01.png)

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

### Example 2: B and delta to C

![Illustration of example 2](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-02.png)

> Given the position of vehicle _B_ and a bearing and distance to an object _C_.
> Find the exact position of _C_. Use WGS-72 ellipsoid.
>
> https://www.ffi.no/en/research/n-vector/#example_2

```ts
import {
  WGS_72,
  deg,
  multiply,
  n_E2R_EN,
  n_E2lat_long,
  n_EA_E_and_p_AB_E2n_EB_E,
  rad,
  rotate,
  unit,
  zyx2R,
  type Vector3,
} from "nvector-geodesy";

// delta vector from B to C, decomposed in B is given:
const p_BC_B: Vector3 = [3000, 2000, 100];

// Position and orientation of B is given:
// unit to get unit length of vector
const n_EB_E = unit([1, 2, 3]);
const z_EB = -400;
// the three angles are yaw, pitch, and roll
const R_NB = zyx2R(rad(10), rad(20), rad(30));

// A custom reference ellipsoid is given (replacing WGS-84):
// (WGS-72)
const a = WGS_72.a;
const f = WGS_72.f;

// Find the position of C.

// SOLUTION:

// Step1: Find R_EN:
const R_EN = n_E2R_EN(n_EB_E);

// Step2: Find R_EB, from R_EN and R_NB:
// Note: closest frames cancel
const R_EB = multiply(R_EN, R_NB);

// Step3: Decompose the delta vector in E:
// no transpose of R_EB, since the vector is in B
const p_BC_E = rotate(R_EB, p_BC_B);

// Step4: Find the position of C, using the functions that goes from one
// position and a delta, to a new position:
const [n_EC_E, z_EC] = n_EA_E_and_p_AB_E2n_EB_E(n_EB_E, p_BC_E, z_EB, a, f);

// When displaying the resulting position for humans, it is more convenient
// to see lat, long:
const [lat_EC, long_EC] = n_E2lat_long(n_EC_E);

// Here we also assume that the user wants the output to be height (= -depth):
const height = -z_EC;
```

### Example 3: ECEF-vector to geodetic latitude

![Illustration of example 3](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-03.png)

> Given an ECEF-vector of a position. Find geodetic latitude, longitude and
> height (using WGS-84 ellipsoid).
>
> https://www.ffi.no/en/research/n-vector/#example_3

```ts
import {
  apply,
  deg,
  n_E2lat_long,
  p_EB_E2n_EB_E,
  type Vector3,
} from "nvector-geodesy";

// Position B is given as p_EB_E ("ECEF-vector")
const p_EB_E: Vector3 = apply((n) => n * 6371e3, [0.71, -0.72, 0.1]); // m

// Find position B as geodetic latitude, longitude and height

// SOLUTION:

// Find n-vector from the p-vector:
const [n_EB_E, z_EB] = p_EB_E2n_EB_E(p_EB_E);

// Convert to lat, long and height:
const [lat_EB, long_EB] = n_E2lat_long(n_EB_E);
const h_EB = -z_EB;
```

### Example 4: Geodetic latitude to ECEF-vector

![Illustration of example 4](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-04.png)

> Given geodetic latitude, longitude and height. Find the ECEF-vector (using
> WGS-84 ellipsoid).
>
> https://www.ffi.no/en/research/n-vector/#example_4

```ts
import { lat_long2n_E, n_EB_E2p_EB_E, rad } from "nvector-geodesy";

// Position B is given with lat, long and height:
const lat_EB_deg = 1;
const long_EB_deg = 2;
const h_EB = 3;

// Find the vector p_EB_E ("ECEF-vector")

// SOLUTION:

// Step1: Convert to n-vector:
const n_EB_E = lat_long2n_E(rad(lat_EB_deg), rad(long_EB_deg));

// Step2: Find the ECEF-vector p_EB_E:
const p_EB_E = n_EB_E2p_EB_E(n_EB_E, -h_EB);
```

### Example 5: Surface distance

![Illustration of example 5](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-05.png)

> Given position _A_ and _B_. Find the surface **distance** (i.e. great circle
> distance) and the Euclidean distance.
>
> https://www.ffi.no/en/research/n-vector/#example_5

```ts
import {
  apply,
  cross,
  dot,
  lat_long2n_E,
  norm,
  rad,
  unit,
  type Vector3,
} from "nvector-geodesy";

// Position A and B are given as n_EA_E and n_EB_E:
// Enter elements directly:
// const n_EA_E = unit([1, 0, -2]);
// const n_EB_E = unit([-1, -2, 0]);

// or input as lat/long in deg:
const n_EA_E = lat_long2n_E(rad(88), rad(0));
const n_EB_E = lat_long2n_E(rad(89), rad(-170));

// m, mean Earth radius
const r_Earth = 6371e3;

// SOLUTION:

// The great circle distance is given by equation (16) in Gade (2010):
// Well conditioned for all angles:
const s_AB =
  Math.atan2(norm(cross(n_EA_E, n_EB_E)), dot(n_EA_E, n_EB_E)) * r_Earth;

// The Euclidean distance is given by:
const d_AB =
  norm(apply((n_EB_E, n_EA_E) => n_EB_E - n_EA_E, n_EB_E, n_EA_E)) * r_Earth;
```

### Example 6: Interpolated position

![Illustration of example 6](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-06.png)

> Given the position of _B_ at time _t<sub>0</sub>_ and _t<sub>1</sub>_. Find an
> **interpolated position** at time _t<sub>i</sub>_.
>
> https://www.ffi.no/en/research/n-vector/#example_6

```ts
import {
  apply,
  deg,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  unit,
  type Vector3,
} from "nvector-geodesy";

// Position B is given at time t0 as n_EB_E_t0 and at time t1 as n_EB_E_t1:
// Enter elements directly:
// const n_EB_E_t0 = unit([1, 0, -2]);
// const n_EB_E_t1 = unit([-1, -2, 0]);

// or input as lat/long in deg:
const n_EB_E_t0 = lat_long2n_E(rad(89.9), rad(-150));
const n_EB_E_t1 = lat_long2n_E(rad(89.9), rad(150));

// The times are given as:
const t0 = 10;
const t1 = 20;
const ti = 16; // time of interpolation

// Find the interpolated position at time ti, n_EB_E_ti

// SOLUTION:

// Using standard interpolation:
const n_EB_E_ti = unit(
  apply(
    (n_EB_E_t0, n_EB_E_t1) =>
      n_EB_E_t0 + ((ti - t0) * (n_EB_E_t1 - n_EB_E_t0)) / (t1 - t0),
    n_EB_E_t0,
    n_EB_E_t1,
  ),
);

// When displaying the resulting position for humans, it is more convenient
// to see lat, long:
const [lat_EB_ti, long_EB_ti] = n_E2lat_long(n_EB_E_ti);
```

### Example 7: Mean position/center

![Illustration of example 7](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-07.png)

> Given three positions _A_, _B_, and _C_. Find the **mean position**
> (center/midpoint).
>
> https://www.ffi.no/en/research/n-vector/#example_7

```ts
import { apply, lat_long2n_E, rad, unit, type Vector3 } from "nvector-geodesy";

// Three positions A, B and C are given:
// Enter elements directly:
// const n_EA_E = unit([1, 0, -2]);
// const n_EB_E = unit([-1, -2, 0]);
// const n_EC_E = unit([0, -2, 3]);

// or input as lat/long in degrees:
const n_EA_E = lat_long2n_E(rad(90), rad(0));
const n_EB_E = lat_long2n_E(rad(60), rad(10));
const n_EC_E = lat_long2n_E(rad(50), rad(-20));

// SOLUTION:

// Find the horizontal mean position, M:
const n_EM_E = unit(
  apply(
    (n_EA_E, n_EB_E, n_EC_E) => n_EA_E + n_EB_E + n_EC_E,
    n_EA_E,
    n_EB_E,
    n_EC_E,
  ),
);
```

### Example 8: A and azimuth/distance to B

![Illustration of example 8](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-08.png)

> Given position _A_ and an azimuth/bearing and a (great circle) distance. Find
> the **destination point** _B_.
>
> https://www.ffi.no/en/research/n-vector/#example_8

```ts
import {
  R_Ee_NP_Z,
  apply,
  cross,
  deg,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  rotate,
  transpose,
  unit,
  type Vector3,
} from "nvector-geodesy";

// Position A is given as n_EA_E:
// Enter elements directly:
// const n_EA_E = unit([1, 0, -2]);

// or input as lat/long in deg:
const n_EA_E = lat_long2n_E(rad(80), rad(-90));

// The initial azimuth and great circle distance (s_AB), and Earth radius
// (r_Earth) are also given:
const azimuth = rad(200);
const s_AB = 1000; // m
const r_Earth = 6371e3; // m, mean Earth radius

// Find the destination point B, as n_EB_E ("The direct/first geodetic
// problem" for a sphere)

// SOLUTION:

// Step1: Find unit vectors for north and east (see equations (9) and (10)
// in Gade (2010):
const k_east_E = unit(cross(rotate(transpose(R_Ee_NP_Z), [1, 0, 0]), n_EA_E));
const k_north_E = cross(n_EA_E, k_east_E);

// Step2: Find the initial direction vector d_E:
const d_E = apply(
  (k_north_E, k_east_E) =>
    k_north_E * Math.cos(azimuth) + k_east_E * Math.sin(azimuth),
  k_north_E,
  k_east_E,
);

// Step3: Find n_EB_E:
const n_EB_E = apply(
  (n_EA_E, d_E) =>
    n_EA_E * Math.cos(s_AB / r_Earth) + d_E * Math.sin(s_AB / r_Earth),
  n_EA_E,
  d_E,
);

// When displaying the resulting position for humans, it is more convenient
// to see lat, long:
const [lat_EB, long_EB] = n_E2lat_long(n_EB_E);
```

### Example 9: Intersection of two paths

![Illustration of example 9](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-09.png)

> Given path _A_ going through _A<sub>1</sub>_ and _A<sub>2</sub>_, and path _B_
> going through _B<sub>1</sub>_ and _B<sub>2</sub>_. Find the **intersection**
> of the two paths.
>
> https://www.ffi.no/en/research/n-vector/#example_9

```ts
import {
  apply,
  cross,
  deg,
  dot,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  unit,
  type Vector3,
} from "nvector-geodesy";

// Two paths A and B are given by two pairs of positions:
// Enter elements directly:
// const n_EA1_E = unit([0, 0, 1]);
// const n_EA2_E = unit([-1, 0, 1]);
// const n_EB1_E = unit([-2, -2, 4]);
// const n_EB2_E = unit([-2, 2, 2]);

// or input as lat/long in deg:
const n_EA1_E = lat_long2n_E(rad(50), rad(180));
const n_EA2_E = lat_long2n_E(rad(90), rad(180));
const n_EB1_E = lat_long2n_E(rad(60), rad(160));
const n_EB2_E = lat_long2n_E(rad(80), rad(-140));

// SOLUTION:

// Find the intersection between the two paths, n_EC_E:
const n_EC_E_tmp = unit(
  cross(cross(n_EA1_E, n_EA2_E), cross(n_EB1_E, n_EB2_E)),
);

// n_EC_E_tmp is one of two solutions, the other is -n_EC_E_tmp. Select the
// one that is closest to n_EA1_E, by selecting sign from the dot product
// between n_EC_E_tmp and n_EA1_E:
const n_EC_E = apply(
  (n) => Math.sign(dot(n_EC_E_tmp, n_EA1_E)) * n,
  n_EC_E_tmp,
);

// When displaying the resulting position for humans, it is more convenient
// to see lat, long:
const [lat_EC, long_EC] = n_E2lat_long(n_EC_E);
```

### Example 10: Cross track distance (cross track error)

![Illustration of example 10](https://raw.githubusercontent.com/ezzatron/nvector-js/main/assets/img/example-10.png)

> Given path _A_ going through _A<sub>1</sub>_ and _A<sub>2</sub>_, and a point
> _B_. Find the **cross track distance**/**cross track error** between _B_ and
> the path.
>
> https://www.ffi.no/en/research/n-vector/#example_10

```ts
import {
  cross,
  dot,
  lat_long2n_E,
  rad,
  unit,
  type Vector3,
} from "nvector-geodesy";

// Position A1 and A2 and B are given as n_EA1_E, n_EA2_E, and n_EB_E:
// Enter elements directly:
// const n_EA1_E = unit([1, 0, -2]);
// const n_EA2_E = unit([-1, -2, 0]);
// const n_EB_E = unit([0, -2, 3]);

// or input as lat/long in deg:
const n_EA1_E = lat_long2n_E(rad(0), rad(0));
const n_EA2_E = lat_long2n_E(rad(10), rad(0));
const n_EB_E = lat_long2n_E(rad(1), rad(0.1));

const r_Earth = 6371e3; // m, mean Earth radius

// Find the cross track distance from path A to position B.

// SOLUTION:

// Find the unit normal to the great circle between n_EA1_E and n_EA2_E:
const c_E = unit(cross(n_EA1_E, n_EA2_E));

// Find the great circle cross track distance: (acos(x) - pi/2 = -asin(x))
const s_xt = -Math.asin(dot(c_E, n_EB_E)) * r_Earth;

// Find the Euclidean cross track distance:
const d_xt = -dot(c_E, n_EB_E) * r_Earth;
```

## Methodology

If you look at the test suite for this library, you'll see that there are very
few concrete test cases. Instead, this library uses model-based testing, powered
by [fast-check], and using the [Python nvector library] as the "model", or
reference implementation.

[fast-check]: https://fast-check.dev/
[python nvector library]: https://nvector.readthedocs.io/

In other words, this library is tested by generating large amounts of "random"
inputs, and then comparing the output with the Python library. This allowed me
to quickly port the library with a high degree of confidence in its correctness,
without a deep understanding of the underlying mathematics.

If you find any issues with the implementations, there's a good chance that the
issue will also be present in the Python library, and an equally good chance
that I won't personally understand how to fix it 😅 Still, don't let that stop
you from opening an issue or a pull request!

## References

- Gade, K. (2010). [A Non-singular Horizontal Position Representation], The
  Journal of Navigation, Volume 63, Issue 03, pp 395-417, July 2010.
- [The n-vector page]
- Ellipsoid data taken from [chrisveness/geodesy]

[a non-singular horizontal position representation]:
  https://www.navlab.net/Publications/A_Nonsingular_Horizontal_Position_Representation.pdf
[the n-vector page]: https://www.ffi.no/en/research/n-vector
[chrisveness/geodesy]: https://github.com/chrisveness/geodesy
