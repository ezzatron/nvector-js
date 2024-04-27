import { WebSocket } from "ws";
import type { Matrix3x3 } from "../src/matrix.js";
import type { Vector3 } from "../src/vector.js";

export type NvectorTestClient = {
  lat_lon2n_E: (
    latitude: number,
    longitude: number,
    R_Ee?: Matrix3x3,
  ) => Promise<Vector3>;

  n_E2lat_lon: (n_E: Vector3, R_Ee?: Matrix3x3) => Promise<LatLonTuple>;

  n_EB_E2p_EB_E: (
    n_EB_E: Vector3,
    depth?: number,
    a?: number,
    f?: number,
    R_Ee?: Matrix3x3,
  ) => Promise<Vector3>;

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
    async lat_lon2n_E(latitude, longitude, R_Ee) {
      return unwrapVector3(
        await call<WrappedVector3>("lat_lon2n_E", {
          latitude,
          longitude,
          R_Ee,
        }),
      );
    },

    async n_E2lat_lon(n_E, R_Ee) {
      return latLonObjectToTuple(
        await call<LatLonObject>("n_E2lat_lon", {
          n_E: wrapVector3(n_E),
          R_Ee,
        }),
      );
    },

    async n_EB_E2p_EB_E(n_EB_E, depth, a, f, R_Ee) {
      return unwrapVector3(
        await call<WrappedVector3>("n_EB_E2p_EB_E", {
          n_EB_E: wrapVector3(n_EB_E),
          depth,
          a,
          f,
          R_Ee,
        }),
      );
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

type LatLonTuple = [latitude: number, longitude: number];
type LatLonObject = {
  latitude: number;
  longitude: number;
};

function latLonObjectToTuple({
  latitude,
  longitude,
}: LatLonObject): LatLonTuple {
  return [latitude, longitude];
}

type WrappedVector3 = [[x: number], [y: number], [z: number]];

function wrapVector3([x, y, z]: Vector3): WrappedVector3 {
  return [[x], [y], [z]];
}

function unwrapVector3([[x], [y], [z]]: WrappedVector3): Vector3 {
  return [x, y, z];
}
