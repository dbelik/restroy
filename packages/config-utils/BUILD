load("@aspect_rules_swc//swc:defs.bzl", "swc")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")
load("@aspect_rules_jasmine//jasmine:defs.bzl", "jasmine_test")
load("@aspect_rules_js//npm:defs.bzl", "npm_package")
load("@npm//:eslint/package_json.bzl", eslint_bin = "bin")
load("@npm//:license-checker/package_json.bzl", license_checker_bin = "bin")
load("@npm//:defs.bzl", "npm_link_all_packages")
load("@npm_prod//:defs.bzl", npm_link_all_prod_packages = "npm_link_all_packages")

# Link all local dependencies.
npm_link_all_packages(name = "node_modules")

npm_link_all_prod_packages(name = "node_modules_prod")

# Build the project.
is_debug = select({
    "//:build_optimized": False,
    "//conditions:default": True,
})

# Compile sources.
ts_project(
    name = "lib",
    srcs = glob(
        [
            "**/*.ts",
        ],
        exclude = ["**/*.spec.ts"],
    ) + [".swcrc"],
    composite = is_debug,
    declaration = True,  # Must be true with SWC compiler
    source_map = is_debug,
    transpiler = swc,
    tsconfig = "//:tsconfig",
    validate = True,
    deps = select({
        "//:build_optimized": [
        ],
        "//conditions:default": [
            "//:node_modules/@types/jasmine",
            "//:node_modules/@types/node",
        ],
    }),
)

npm_package(
    name = "config-utils",
    srcs = [":lib"],
    package = "@restroy/config-utils",
    visibility = ["//visibility:public"],
)

# Automated tests and linters
ts_project(
    name = "dist-tests",
    srcs = glob(["**/*.spec.ts"]) + [".swcrc"],
    composite = True,
    declaration = True,
    source_map = True,
    transpiler = swc,
    tsconfig = "//:tsconfig",
    deps = [
        ":lib",
        "//:node_modules/@types/jasmine",
        "//:node_modules/@types/node",
    ],
)

jasmine_test(
    name = "tests",
    args = ["**/*.spec.js"],
    chdir = package_name(),
    data = [
        ":dist-tests",
    ],
    node_modules = "//:node_modules",
)

eslint_bin.eslint_test(
    name = "lint.check",
    args = ["{}/{}".format(
        package_name(),
        "**/*.ts",
    )],
    data = [
        "package.json",
        ":node_modules",
        "//:eslintrc",
        "//:node_modules",
        "//:tsconfig",
    ] + glob([
        "**/*.ts",
    ]),
    visibility = ["//:__pkg__"],
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
