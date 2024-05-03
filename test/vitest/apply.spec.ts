import { expect, test } from "vitest";
import { apply, type Vector3 } from "../../src/index.js";

test.each`
  label                                | fn                                           | v                         | expected
  ${"Find the sum of two vectors"}     | ${(a: number, b: number) => a + b}           | ${[[1, 2, 3], [4, 5, 6]]} | ${[5, 7, 9]}
  ${"Scale a vector by a scalar"}      | ${(i: number) => i * 2}                      | ${[[1, 2, 3]]}            | ${[2, 4, 6]}
  ${"Interpolate between two vectors"} | ${(a: number, b: number) => a + (b - a) / 2} | ${[[1, 2, 3], [4, 5, 6]]} | ${[2.5, 3.5, 4.5]}
`(
  "apply() $label",
  ({ fn, v, expected }: { fn: () => number; v: []; expected: Vector3 }) => {
    expect(apply(fn, ...v)).toEqual(expected);
  },
);
