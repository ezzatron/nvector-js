export NODE_OPTIONS := --experimental-vm-modules --redirect-warnings=artifacts/node-warnings

CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/nvector-js/releases/tag/

################################################################################

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk
-include .makefiles/pkg/js/v1/with-tsc.mk
-include .makefiles/pkg/changelog/v1/Makefile

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

artifacts/dist: tsconfig.build.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	@touch "$@"
