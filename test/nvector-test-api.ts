import type {
  Matrix,
  Vector,
  delta,
  destination,
  eulerXYZToRotationMatrix,
  eulerZYXToRotationMatrix,
  fromECEF,
  fromGeodeticCoordinates,
  fromRotationMatrix,
  rotationMatrixToEulerXYZ,
  rotationMatrixToEulerZYX,
  toECEF,
  toGeodeticCoordinates,
  toRotationMatrix,
  toRotationMatrixUsingWanderAzimuth,
} from "nvector-geodesy";
import { WebSocket } from "ws";

export type NvectorTestClient = {
  fromGeodeticCoordinates: Async<typeof fromGeodeticCoordinates>;
  toRotationMatrixUsingWanderAzimuth: Async<
    typeof toRotationMatrixUsingWanderAzimuth
  >;
  toGeodeticCoordinates: Async<typeof toGeodeticCoordinates>;
  toRotationMatrix: Async<typeof toRotationMatrix>;
  delta: Async<typeof delta>;
  destination: Async<typeof destination>;
  toECEF: Async<typeof toECEF>;
  fromECEF: Async<typeof fromECEF>;
  fromRotationMatrix: Async<typeof fromRotationMatrix>;
  rotationMatrixToEulerXYZ: Async<typeof rotationMatrixToEulerXYZ>;
  rotationMatrixToEulerZYX: Async<typeof rotationMatrixToEulerZYX>;
  eulerXYZToRotationMatrix: Async<typeof eulerXYZToRotationMatrix>;
  eulerZYXToRotationMatrix: Async<typeof eulerZYXToRotationMatrix>;

  close: () => void;
};

export async function createNvectorTestClient(): Promise<NvectorTestClient> {
  const ws = new WebSocket("ws://localhost:17357");
  let seq = 0;

  await new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });

  return {
    async fromGeodeticCoordinates(latitude, longitude, frame) {
      return unwrapVector3(
        await call<WrappedVector3>("lat_lon2n_E", {
          latitude,
          longitude,
          R_Ee: frame,
        }),
      );
    },

    async toRotationMatrixUsingWanderAzimuth(vector, wanderAzimuth, frame) {
      return await call<Matrix>("n_E_and_wa2R_EL", {
        n_E: wrapVector3(vector),
        wander_azimuth: wanderAzimuth,
        R_Ee: frame,
      });
    },

    async toGeodeticCoordinates(vector, frame) {
      const { latitude, longitude } = await call<{
        latitude: number;
        longitude: number;
      }>("n_E2lat_lon", {
        n_E: wrapVector3(vector),
        R_Ee: frame,
      });

      return [latitude, longitude];
    },

    async toRotationMatrix(vector, frame) {
      return await call<Matrix>("n_E2R_EN", {
        n_E: wrapVector3(vector),
        R_Ee: frame,
      });
    },

    async delta(from, to, fromDepth, toDepth, ellipsoid, frame) {
      return unwrapVector3(
        await call<WrappedVector3>("n_EA_E_and_n_EB_E2p_AB_E", {
          n_EA_E: wrapVector3(from),
          n_EB_E: wrapVector3(to),
          z_EA: fromDepth,
          z_EB: toDepth,
          a: ellipsoid?.a,
          f: ellipsoid?.f,
          R_Ee: frame,
        }),
      );
    },

    async destination(from, delta, fromDepth, ellipsoid, frame) {
      const { n_EB_E, z_EB } = await call<{
        n_EB_E: WrappedVector3;
        z_EB: number;
      }>("n_EA_E_and_p_AB_E2n_EB_E", {
        n_EA_E: wrapVector3(from),
        p_AB_E: wrapVector3(delta),
        z_EA: fromDepth,
        a: ellipsoid?.a,
        f: ellipsoid?.f,
        R_Ee: frame,
      });

      return [unwrapVector3(n_EB_E), z_EB];
    },

    async toECEF(vector, depth, ellipsoid, frame) {
      return unwrapVector3(
        await call<WrappedVector3>("n_EB_E2p_EB_E", {
          n_EB_E: wrapVector3(vector),
          depth,
          a: ellipsoid?.a,
          f: ellipsoid?.f,
          R_Ee: frame,
        }),
      );
    },

    async fromECEF(vector, ellipsoid, frame) {
      const { n_EB_E, depth } = await call<{
        n_EB_E: WrappedVector3;
        depth: number;
      }>("p_EB_E2n_EB_E", {
        p_EB_E: wrapVector3(vector),
        a: ellipsoid?.a,
        f: ellipsoid?.f,
        R_Ee: frame,
      });

      return [unwrapVector3(n_EB_E), depth];
    },

    async fromRotationMatrix(rotation) {
      return unwrapVector3(
        await call<WrappedVector3>("R_EN2n_E", { R_EN: rotation }),
      );
    },

    async rotationMatrixToEulerXYZ(rotation) {
      const { x, y, z } = await call<{ x: number; y: number; z: number }>(
        "R2xyz",
        { R_AB: rotation },
      );

      return [x, y, z];
    },

    async rotationMatrixToEulerZYX(rotation) {
      const { z, y, x } = await call<{ z: number; y: number; x: number }>(
        "R2zyx",
        { R_AB: rotation },
      );

      return [z, y, x];
    },

    async eulerXYZToRotationMatrix(x, y, z) {
      return await call<Matrix>("xyz2R", { x, y, z });
    },

    async eulerZYXToRotationMatrix(z, y, x) {
      return await call<Matrix>("zyx2R", { z, y, x });
    },

    close: () => ws.close(),
  };

  async function call<T>(fn: string, args: object): Promise<T> {
    const id = ++seq;
    ws.send(JSON.stringify({ id, fn, args }));

    return new Promise((resolve, reject) => {
      function handleMessage(message: string) {
        const response = JSON.parse(message) as Message;

        if (response.id !== id) return;

        ws.off("message", handleMessage);

        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result as T);
        }
      }

      ws.on("message", handleMessage);
    });
  }
}

type Message = ResultMessage | ErrorMessage;

type ResultMessage = {
  id: number;
  result: unknown;
  error: undefined;
};

type ErrorMessage = {
  id: number;
  error: string;
  result: undefined;
};

type WrappedVector3 = [[x: number], [y: number], [z: number]];

function wrapVector3([x, y, z]: Vector): WrappedVector3 {
  return [[x], [y], [z]];
}

function unwrapVector3([[x], [y], [z]]: WrappedVector3): Vector {
  return [x, y, z];
}

type Async<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : never;
