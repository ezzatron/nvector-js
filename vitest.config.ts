import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["test/vitest/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
