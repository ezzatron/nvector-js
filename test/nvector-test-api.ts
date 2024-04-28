import { WebSocket } from "ws";
import type {
  lat_lon2n_E,
  n_E2lat_lon,
  n_EA_E_and_n_EB_E2p_AB_E,
  n_EA_E_and_p_AB_E2n_EB_E,
  n_EB_E2p_EB_E,
  p_EB_E2n_EB_E,
} from "../src/index.js";
import type { Vector3 } from "../src/vector.js";

export type NvectorTestClient = {
  lat_lon2n_E: Async<typeof lat_lon2n_E>;
  n_E2lat_lon: Async<typeof n_E2lat_lon>;
  n_EA_E_and_n_EB_E2p_AB_E: Async<typeof n_EA_E_and_n_EB_E2p_AB_E>;
  n_EA_E_and_p_AB_E2n_EB_E: Async<typeof n_EA_E_and_p_AB_E2n_EB_E>;
  n_EB_E2p_EB_E: Async<typeof n_EB_E2p_EB_E>;
  p_EB_E2n_EB_E: Async<typeof p_EB_E2n_EB_E>;

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
      const { latitude, longitude } = await call<{
        latitude: number;
        longitude: number;
      }>("n_E2lat_lon", {
        n_E: wrapVector3(n_E),
        R_Ee,
      });

      return [latitude, longitude];
    },

    async n_EA_E_and_n_EB_E2p_AB_E(n_EA_E, n_EB_E, z_EA, z_EB, a, f, R_Ee) {
      return unwrapVector3(
        await call<WrappedVector3>("n_EA_E_and_n_EB_E2p_AB_E", {
          n_EA_E: wrapVector3(n_EA_E),
          n_EB_E: wrapVector3(n_EB_E),
          z_EA,
          z_EB,
          a,
          f,
          R_Ee,
        }),
      );
    },

    async n_EA_E_and_p_AB_E2n_EB_E(n_EA_E, p_AB_E, z_EA, a, f, R_Ee) {
      const { n_EB_E, z_EB } = await call<{
        n_EB_E: WrappedVector3;
        z_EB: number;
      }>("n_EA_E_and_p_AB_E2n_EB_E", {
        n_EA_E: wrapVector3(n_EA_E),
        p_AB_E: wrapVector3(p_AB_E),
        z_EA,
        a,
        f,
        R_Ee,
      });

      return [unwrapVector3(n_EB_E), z_EB];
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

    async p_EB_E2n_EB_E(p_EB_E, a, f, R_Ee) {
      const { n_EB_E, depth } = await call<{
        n_EB_E: WrappedVector3;
        depth: number;
      }>("p_EB_E2n_EB_E", {
        p_EB_E: wrapVector3(p_EB_E),
        a,
        f,
        R_Ee,
      });

      return [unwrapVector3(n_EB_E), depth];
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

function wrapVector3([x, y, z]: Vector3): WrappedVector3 {
  return [[x], [y], [z]];
}

function unwrapVector3([[x], [y], [z]]: WrappedVector3): Vector3 {
  return [x, y, z];
}

type Async<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : never;
