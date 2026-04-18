import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["test/vitest/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
