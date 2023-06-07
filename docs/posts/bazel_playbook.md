# Bazel

## General

For each subproject, whether it's a library or a service, it is important to include
rules for various tests in Bazel.

## Typescript Libraries

When creating TypeScript libraries with Bazel, follow these steps:

1. **Create package.json, .swcrc and BUILD file**: Start by creating a package.json file to
   manage your library's dependencies. Also, create a BUILD file to define the Bazel
   build configuration for your library. The .swcrc file tells SWC compiler to transpile
   to CommonJS, rather than default Ecmascript.

2. **Define ts_project and npm_package rules in BUILD file**:

   - Use the ts_project rule to specify the TypeScript sources and dependencies for
     your library.

   - Use the npm_package rule to define the packaging and visibility of your library.
     Make sure to set the visibility of the npm_package rule to be publicly accessible,
     allowing other projects or services to depend on your library.

Here is an example snippet of a BUILD file for a TypeScript library:

```python
# Compile sources.
ts_project(
    name = "lib",
    srcs = glob(
        ["**/*.ts", ".swcrc"],
        exclude = ["**/*.spec.ts"],
    ),
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

        # Include node modules (if any) in dependencies (for tests as well),
        # otherwise you may run into `not all outputs were created or valid`
        # error.
        "//conditions:default": [
            ":node_modules",
            "//:node_modules/@types/jasmine",
            "//:node_modules/@types/node",
        ],
    }),
)

npm_package(
    name = "  module name  ",
    srcs = [":lib"],
    package = "  @your-library  ",
    visibility = ["//visibility:public"],
)
```

## Docker

To ensure that our services can run as containers, we have chosen Docker as our
containerization platform. To simplify the process of building and pushing Docker
images, we leverage the `rules_oci` library in `Bazel`, which provides the necessary
rules and tools.

When creating a new service, it is essential to include the following rules in the
`BUILD` file. These rules enable us to build Docker images efficiently:

```python
js_image_layer(
    name = "layers",
    binary = ":binary",
    root = "/app",
)

oci_image(
    name = "image",
    base = "@debian-slim",
    cmd = ["/app/path/to/binary"],
    entrypoint = ["bash"],
    tars = [
        ":layers",
    ],
)

oci_tarball(
    name = "tarball",
    image = ":image",
    repo_tags = ["*image name*:latest"],
)
```

Let's break down the purpose of each rule:

- `js_image_layer`: This rule defines the image layers for our service. It specifies
  the binary target, the root directory, and visibility settings. The binary is placed
  in the designated root directory to ensure the correct file structure in the resulting image.
- `oci_image`: This rule generates the OCI image for our service. It specifies the
  base image (in this case, "@debian-slim"), the command to run our binary within the
  container, the entrypoint (in this case, "bash"), and the image layers to include (in
  this case, the "layers" rule).
- `oci_tarball`: This rule creates an OCI tarball from the generated image. It
  specifies the image target and the repository tags for the tarball, allowing us to
  easily identify and distribute the image.

It's worth noting that when developing locally, we recommend running services as
binaries rather than containers. The Docker rules we use are primarily for deployment
purposes. By running services as binaries during local development, we can simplify
the development workflow and reduce the complexity introduced by containerization.
