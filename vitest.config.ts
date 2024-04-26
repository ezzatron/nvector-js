import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["test/vitest/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
