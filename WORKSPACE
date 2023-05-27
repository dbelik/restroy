# Restroy workspace that sets up all packages that are used
# to build the entire project.
workspace(name = "restroy")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Download the necessary packages.
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "b1e80761a8a8243d03ebca8845e9cc1ba6c82ce7c5179ce2b295cd36f7e394bf",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.25.0/rules_docker-v0.25.0.tar.gz"],
)

http_archive(
    name = "aspect_rules_js",
    sha256 = "d8827db3c34fe47607a0668e86524fd85d5bd74f2bfca93046d07f890b5ad4df",
    strip_prefix = "rules_js-1.27.0",
    url = "https://github.com/aspect-build/rules_js/releases/download/v1.27.0/rules_js-v1.27.0.tar.gz",
)

http_archive(
    name = "aspect_rules_ts",
    sha256 = "ace5b609603d9b5b875d56c9c07182357c4ee495030f40dcefb10d443ba8c208",
    strip_prefix = "rules_ts-1.4.0",
    url = "https://github.com/aspect-build/rules_ts/releases/download/v1.4.0/rules_ts-v1.4.0.tar.gz",
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

# NOTE: Docker rules will fail is we don't generate build_bazel_rules_nodejs with version 5.8.0.
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "dcc55f810142b6cf46a44d0180a5a7fb923c04a5061e2e8d8eb05ccccc60864b",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.0/rules_nodejs-5.8.0.tar.gz"],
)

http_archive(
    name = "rules_nodejs",
    sha256 = "08337d4fffc78f7fe648a93be12ea2fc4e8eb9795a4e6aa48595b66b34555626",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.0/rules_nodejs-core-5.8.0.tar.gz"],
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
pnpm_version = "7.26.2"

# Set up Typescript and Node.js dependencies.
load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

rules_js_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = DEFAULT_NODE_VERSION,
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
]

npm_translate_lock(
    name = "npm_prod",
    data = packages,
    generate_bzl_library_targets = True,
    npmrc = "//:.npmrc",
    pnpm_lock = "//:pnpm-lock.yaml",
    pnpm_version = pnpm_version,
    prod = True,
    update_pnpm_lock = True,
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

# Set up Docker containers.
load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load(
    "@io_bazel_rules_docker//nodejs:image.bzl",
    _nodejs_image_repos = "repositories",
)

_nodejs_image_repos()

# Buildifier setup
load("@buildifier_prebuilt//:deps.bzl", "buildifier_prebuilt_deps")

buildifier_prebuilt_deps()

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@buildifier_prebuilt//:defs.bzl", "buildifier_prebuilt_register_toolchains")

buildifier_prebuilt_register_toolchains()
