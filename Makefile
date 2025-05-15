CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/nvector-js/releases/tag/

JS_ARETHETYPESWRONG_REQ += artifacts/dist
JS_PUBLINT_REQ += artifacts/dist
JS_SIZE_LIMIT_REQ += artifacts/dist
JS_SKYPACK_PACKAGE_CHECK_REQ += artifacts/dist
JS_TYPEDOC_REQ += artifacts/dist

################################################################################

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk
-include .makefiles/pkg/js/v1/with-arethetypeswrong.mk
-include .makefiles/pkg/js/v1/with-publint.mk
-include .makefiles/pkg/js/v1/with-skypack-package-check.mk
-include .makefiles/pkg/js/v1/with-tsc.mk
-include .makefiles/pkg/changelog/v1/Makefile

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

artifacts/dist: tsconfig.build.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	@touch "$@"
