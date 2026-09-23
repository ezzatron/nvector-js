import { GenericContainer, Wait } from "testcontainers";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    testApiUrl: string;
  }
}

export async function setup(
  project: TestProject,
): Promise<(() => Promise<void>) | undefined> {
  if (process.env.CI) {
    project.provide("testApiUrl", "ws://localhost:17357");

    return;
  }

  const container = await new GenericContainer(
    "ghcr.io/ezzatron/nvector-test-api",
  )
    .withExposedPorts(8000)
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  project.provide(
    "testApiUrl",
    `ws://${container.getHost()}:${container.getMappedPort(8000)}`,
  );

  return async () => {
    await container.stop();
  };
}
