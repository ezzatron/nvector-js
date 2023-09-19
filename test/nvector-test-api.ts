import { WebSocket } from "ws";

export type NvectorTestClient = {
  lat_lon2n_E: (
    lat: number,
    lon: number,
  ) => Promise<[x: number, y: number, z: number]>;

  n_E2lat_lon: (
    x: number,
    y: number,
    z: number,
  ) => Promise<[lat: number, lon: number]>;

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
    async lat_lon2n_E(lat, lon) {
      const [[x], [y], [z]] = await call<[[number], [number], [number]]>(
        "lat_lon2n_E",
        { latitude: lat, longitude: lon },
      );

      return [x, y, z];
    },

    async n_E2lat_lon(x, y, z) {
      const { latitude, longitude } = await call<{
        latitude: number;
        longitude: number;
      }>("n_E2lat_lon", {
        n_E: [[x], [y], [z]],
      });

      return [latitude, longitude];
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
