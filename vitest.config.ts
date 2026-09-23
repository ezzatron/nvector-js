import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    attachmentsDir: "artifacts/vitest/attachments",
    globalSetup: ["test/vitest/global-setup.ts"],
    include: ["test/vitest/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
