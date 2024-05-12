import type { Matrix3x3 } from "./matrix.js";
import type { Vector3 } from "./vector.js";

/**
 * 3 angles about new axes in the zyx order are found from a rotation matrix.
 *
 * 3 angles z,y,x about new axes (intrinsic) in the order z-y-x are found from
 * the rotation matrix R_AB. The angles (called Euler angles or Tait–Bryan
 * angles) are defined by the following procedure of successive rotations:
 *
 * Given two arbitrary coordinate frames A and B. Consider a temporary frame T
 * that initially coincides with A. In order to make T align with B, we first
 * rotate T an angle z about its z-axis (common axis for both A and T).
 * Secondly, T is rotated an angle y about the NEW y-axis of T. Finally, T is
 * rotated an angle x about its NEWEST x-axis. The final orientation of T now
 * coincides with the orientation of B.
 *
 * The signs of the angles are given by the directions of the axes and the right
 * hand rule.
 *
 * Note that if A is a north-east-down frame and B is a body frame, we have that
 * z = yaw, y = pitch and x = roll.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R2zyx.m
 *
 * @param R_AB - 3x3 rotation matrix (direction cosine matrix) such that the
 *   relation between a vector v decomposed in A and B is given by: v_A = R_AB *
 *   v_B.
 *
 * @returns Angles of rotation about new axes.
 */
export function R2zyx(R_AB: Matrix3x3): Vector3 {
  const [[r11, r12], [r21, r22], [r31, r32, r33]] = R_AB;

  // cos_y is based on as many elements as possible, to average out numerical
  // errors. It is selected as the positive square root since y: [-pi/2 pi/2]
  const cos_y = Math.sqrt((r11 ** 2 + r21 ** 2 + r32 ** 2 + r33 ** 2) / 2);

  const n_of_eps_to_define_singularity = 10;
  let z, y, x;

  // Check if (close to) Euler angle singularity:
  if (cos_y > n_of_eps_to_define_singularity * Number.EPSILON) {
    // Outside singularity:
    // atan2: [-pi pi]
    z = Math.atan2(r21, r11);
    x = Math.atan2(r32, r33);

    const sin_y = -r31;

    y = Math.atan2(sin_y, cos_y);
  } else {
    // In singularity (or close to), i.e. y = +pi/2 or -pi/2:
    // Selecting y = +-pi/2, with correct sign
    y = (Math.sign(r31) * Math.PI) / 2;

    // Only the sum/difference of x and z is now given, choosing x = 0:
    x = 0;

    // Upper right 2x2 elements of R_AB now only consists of sin_z and cos_z.
    // Using the two whose signs are the same for both singularities:
    z = Math.atan2(-r12, r22);
  }

  return [z, y, x];
}
