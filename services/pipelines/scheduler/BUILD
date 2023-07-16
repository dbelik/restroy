load("@aspect_rules_swc//swc:defs.bzl", "swc")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")
load("@aspect_rules_js//js:defs.bzl", "js_binary", "js_image_layer")

# load("@aspect_rules_jasmine//jasmine:defs.bzl", "jasmine_test")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_tarball")
load("@npm//:eslint/package_json.bzl", eslint_bin = "bin")
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
    name = "scheduler",
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
            ":node_modules_prod",
        ],
        "//conditions:default": [
            ":node_modules",
            "//:node_modules/@types/jasmine",
            "//:node_modules/@types/node",
        ],
    }),
)

js_binary(
    name = "binary",
    data = [
        ":scheduler",
    ],
    entry_point = "sources/server.js",
)

# Automated tests and linters
# ts_project(
#     name = "dist-tests",
#     srcs = glob(["**/*.spec.ts"]) + [".swcrc"],
#     composite = True,
#     declaration = True,
#     source_map = True,
#     transpiler = swc,
#     tsconfig = "//:tsconfig",
#     deps = [
#         ":scheduler",
#         ":node_modules",
#         "//:node_modules/@types/jasmine",
#         "//:node_modules/@types/node",
#     ],
# )

# jasmine_test(
#     name = "tests",
#     args = ["**/*.spec.js"],
#     chdir = package_name(),
#     data = [
#         ":dist-tests",
#     ],
#     node_modules = "//:node_modules",
# )

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

# Build and publish Docker image
js_image_layer(
    name = "layers",
    binary = ":binary",
    root = "/app",
)

oci_image(
    name = "image",
    base = "@debian-slim",
    cmd = ["/app/services/pipelines/scheduler/binary"],
    entrypoint = ["bash"],
    tars = [
        ":layers",
    ],
)

oci_tarball(
    name = "tarball",
    image = ":image",
    repo_tags = ["restroy/pipeline-scheduler:latest"],
    visibility = ["//:__pkg__"],
)
