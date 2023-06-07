# Restroy workspace that sets up all packages that are used
# to build the entire project.
workspace(name = "restroy")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Download the necessary packages.
http_archive(
    name = "rules_oci",
    sha256 = "db57efd706f01eb3ce771468366baa1614b5b25f4cce99757e2b8d942155b8ec",
    strip_prefix = "rules_oci-1.0.0",
    url = "https://github.com/bazel-contrib/rules_oci/releases/download/v1.0.0/rules_oci-v1.0.0.tar.gz",
)

http_archive(
    name = "aspect_rules_js",
    sha256 = "0b69e0967f8eb61de60801d6c8654843076bf7ef7512894a692a47f86e84a5c2",
    strip_prefix = "rules_js-1.27.1",
    url = "https://github.com/aspect-build/rules_js/releases/download/v1.27.1/rules_js-v1.27.1.tar.gz",
)

# NOTE: We'll use old rules_ts version because of this: https://github.com/aspect-build/rules_ts/issues/334
# Update when this issue is fixed.
http_archive(
    name = "aspect_rules_ts",
    sha256 = "5b501313118b06093497b6429f124b973f99d1eb5a27a1cc372e5d6836360e9d",
    strip_prefix = "rules_ts-1.0.2",
    url = "https://github.com/aspect-build/rules_ts/archive/refs/tags/v1.0.2.tar.gz",
)

http_archive(
    name = "aspect_rules_swc",
    sha256 = "b647c7c31feeb7f9330fff08b45f8afe7de674d3a9c89c712b8f9d1723d0c8f9",
    strip_prefix = "rules_swc-1.0.1",
    url = "https://github.com/aspect-build/rules_swc/releases/download/v1.0.1/rules_swc-v1.0.1.tar.gz",
)

http_archive(
    name = "bazel_skylib",
    sha256 = "b8a1527901774180afc798aeb28c4634bdccf19c4d98e7bdd1ce79d1fe9aaad7",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.4.1/bazel-skylib-1.4.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.4.1/bazel-skylib-1.4.1.tar.gz",
    ],
)

# # NOTE: Docker rules will fail is we don't generate build_bazel_rules_nodejs with version 5.8.0.
# http_archive(
#     name = "build_bazel_rules_nodejs",
#     sha256 = "dcc55f810142b6cf46a44d0180a5a7fb923c04a5061e2e8d8eb05ccccc60864b",
#     urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.0/rules_nodejs-5.8.0.tar.gz"],
# )

http_archive(
    name = "rules_nodejs",
    sha256 = "764a3b3757bb8c3c6a02ba3344731a3d71e558220adcb0cf7e43c9bba2c37ba8",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.2/rules_nodejs-core-5.8.2.tar.gz"],
)

http_archive(
    name = "aspect_rules_jasmine",
    sha256 = "5a263b8ff5c708db63fff41af737bd1c37b9cec641b303e66944e342e5ca0550",
    strip_prefix = "rules_jasmine-1.0.0",
    url = "https://github.com/aspect-build/rules_jasmine/releases/download/v1.0.0/rules_jasmine-v1.0.0.tar.gz",
)

http_archive(
    name = "rules_multirun",
    sha256 = "9ced12fb88f793c2f0a8c19f498485c4a95c22c91bb51fc4ec6812d41fc3331d",
    strip_prefix = "rules_multirun-0.6.0",
    url = "https://github.com/keith/rules_multirun/archive/refs/tags/0.6.0.tar.gz",
)

http_archive(
    name = "buildifier_prebuilt",
    sha256 = "e46c16180bc49487bfd0f1ffa7345364718c57334fa0b5b67cb5f27eba10f309",
    strip_prefix = "buildifier-prebuilt-6.1.0",
    urls = [
        "https://github.com/keith/buildifier-prebuilt/archive/6.1.0.tar.gz",
    ],
)

# Environment setup
pnpm_version = "8.5.1"

node_version = "18.12.1"

# Set up Typescript and Node.js dependencies.
load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

rules_js_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = node_version,
)

load("@aspect_rules_ts//ts:repositories.bzl", "rules_ts_dependencies")

rules_ts_dependencies(ts_version_from = "//:package.json")

load("@aspect_rules_swc//swc:dependencies.bzl", "rules_swc_dependencies")

rules_swc_dependencies()

load("@aspect_rules_swc//swc:repositories.bzl", "swc_register_toolchains", LATEST_SWC_VERSION = "LATEST_VERSION")

swc_register_toolchains(
    name = "swc",
    swc_version = LATEST_SWC_VERSION,
)

load("@aspect_rules_jasmine//jasmine:dependencies.bzl", "rules_jasmine_dependencies")

rules_jasmine_dependencies()

# Install Node.js packages. We need to install 2 different versions for each package.json,
# because we need both optimized and debug builds.
load("@aspect_rules_js//npm:npm_import.bzl", "npm_translate_lock")

packages = [
    "//:package.json",
    "//:pnpm-workspace.yaml",
    "//packages/pipeline-utils:package.json",
    "//packages/config-utils:package.json",
    "//packages/kafka-client:package.json",
    "//services/pipelines/runner:package.json",
]

npm_translate_lock(
    name = "npm_prod",
    data = packages,
    generate_bzl_library_targets = True,
    npmrc = "//:.npmrc",
    pnpm_lock = "//:pnpm-lock.yaml",
    pnpm_version = pnpm_version,
    prod = True,
    update_pnpm_lock = False,
    verify_node_modules_ignored = "//:.bazelignore",
)

npm_translate_lock(
    name = "npm",
    data = packages,
    generate_bzl_library_targets = True,
    npmrc = "//:.npmrc",
    pnpm_lock = "//:pnpm-lock.yaml",
    pnpm_version = pnpm_version,
    update_pnpm_lock = True,
    verify_node_modules_ignored = "//:.bazelignore",
)

load("@npm_prod//:repositories.bzl", npm_repositories_prod = "npm_repositories")

npm_repositories_prod()

load("@npm//:repositories.bzl", "npm_repositories")

npm_repositories()

# Set up Docker.
load("@rules_oci//oci:dependencies.bzl", "rules_oci_dependencies")
load("@rules_oci//oci:pull.bzl", "oci_pull")

rules_oci_dependencies()

load("@rules_oci//oci:repositories.bzl", "LATEST_CRANE_VERSION", "oci_register_toolchains")

oci_register_toolchains(
    name = "oci",
    crane_version = LATEST_CRANE_VERSION,
)

oci_pull(
    name = "debian-slim",
    digest = "sha256:8d498c9133965638a6c161f541829352e4a9907969e6b0fd3f9efa1b3acae80b",
    image = "debian",
)

# Buildifier setup
load("@buildifier_prebuilt//:deps.bzl", "buildifier_prebuilt_deps")

buildifier_prebuilt_deps()

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@buildifier_prebuilt//:defs.bzl", "buildifier_prebuilt_register_toolchains")

buildifier_prebuilt_register_toolchains()
