load("@aspect_rules_js//js:defs.bzl", "js_library")
load("@aspect_rules_ts//ts:defs.bzl", "ts_config")
load("@buildifier_prebuilt//:rules.bzl", "buildifier")
load("@bazel_skylib//rules:build_test.bzl", "build_test")
load("@npm//:defs.bzl", "npm_link_all_packages")
load("@npm_prod//:defs.bzl", npm_link_all_prod_packages = "npm_link_all_packages")
load("@npm//:@commitlint/cli/package_json.bzl", commitlint_bin = "bin")
load("@npm//:license-checker/package_json.bzl", license_checker_bin = "bin")

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
        # Services & Packages
        "//packages/pipeline-utils",
        "//packages/config-utils",
        "//packages/kafka-client",
        "//packages/api-clients",
        "//packages/core",
        "//services/apis/general:tarball",
        "//services/pipelines/runner:tarball",
        "//services/pipelines/scheduler:tarball",

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

allowed_licenses = "MIT;BSD-2-Clause;ISC;Apache-2.0;BSD-3-Clause;UNLICENSED"

license_checker_bin.license_checker_test(
    name = "license-check",
    args = [
        "--onlyAllow",
        allowed_licenses,
    ],
    chdir = package_name(),
    data = [
        "package.json",
        ":node_modules",
    ],
)
