import { describe, expect, it } from "vitest";
import { angleDelta } from "../util.js";

describe("angleDelta()", () => {
  it.each`
    label                                          | a      | b                     | expected
    ${"identical angles"}                          | ${0}   | ${0}                  | ${0}
    ${"small difference"}                          | ${0}   | ${0.5}                | ${0.5}
    ${"negative difference"}                       | ${-1}  | ${1}                  | ${2}
    ${"antipodal angles"}                          | ${0}   | ${Math.PI}            | ${Math.PI}
    ${"wrapping across zero"}                      | ${0.1} | ${2 * Math.PI - 0.1}  | ${0.2}
    ${"difference greater than a full turn"}       | ${0}   | ${2 * Math.PI + 0.5}  | ${0.5}
    ${"negative difference less than a full turn"} | ${0}   | ${-2 * Math.PI - 0.5} | ${0.5}
  `(
    "$label",
    ({ a, b, expected }: { a: number; b: number; expected: number }) => {
      expect(angleDelta(a, b)).toBeCloseTo(expected, 14);
    },
  );
});
