load("@aspect_rules_js//js:defs.bzl", "js_library")
load("@aspect_rules_ts//ts:defs.bzl", "ts_config")

# load("@rules_multirun//:defs.bzl", "multirun")
load("@buildifier_prebuilt//:rules.bzl", "buildifier")
load("@bazel_skylib//rules:build_test.bzl", "build_test")
load("@npm//:defs.bzl", "npm_link_all_packages")
load("@npm_prod//:defs.bzl", npm_link_all_prod_packages = "npm_link_all_packages")
load("@npm//:@commitlint/cli/package_json.bzl", commitlint_bin = "bin")

# Link all local dependencies.
npm_link_all_packages(name = "node_modules")

npm_link_all_prod_packages(name = "node_modules_prod")

ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
    visibility = ["//visibility:public"],
)

js_library(
    name = "eslintrc",
    srcs = [".eslintrc"],
    visibility = ["//visibility:public"],
)

# Create various commands by grouping related targets.
# multirun(
#     name = "publish",
#     commands = [
#       # Run publish instructions for all services.
#       "echo 'You publish instructions here.''"
#     ],
#     jobs = 0,
# )

# Bazel linter
buildifier(
    name = "buildifier.check",
    diff_command = "diff",
    exclude_patterns = [
        "./.git/*",
        "*/node_modules/*",
    ],
    lint_mode = "warn",
    mode = "diff",
)

buildifier(
    name = "buildifier.fix",
    exclude_patterns = [
        "./.git/*",
        "*/node_modules/*",
    ],
    lint_mode = "warn",
    mode = "fix",
)

# Test that the core targets can build.
build_test(
    name = "build.check",
    targets = [
        # Services
        # Publish target creates a dependency graph for most targets.

        # Misc. targets
        ":node_modules",
        ":node_modules_prod",
    ],
)

# Runs commitlint to check that commits follow
# the conventional commits spec.
commitlint_bin.commitlint_binary(
    name = "commits.check",
    args = [
        "--from",
        "stable",
    ],
    chdir = package_name(),
    data = [
        ".commitlintrc",
        ":node_modules",
    ],
)

# Various configuration
config_setting(
    name = "build_optimized",
    values = {
        "define": "build=optimized",
    },
    visibility = ["//visibility:public"],
)
