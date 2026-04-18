import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/vitest/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
