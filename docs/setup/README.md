# Setup

## Tooling

Before getting started, make sure you have the following tools installed:

- Bazel
- Docker compose

## Startup

To start the services, follow these steps:

1. Build all service images using Bazel. Run the following command:
   ```bash
   TODO
   ```
   This will build the necessary images for the services.
2. Run the services using Docker Compose. Execute the following command:
   ```bash
   COMPOSE_PROFILES=pgadmin,kafkaui docker compose up
   ```
   Replace `COMPOSE_PROFILES` with the desired profiles or leave it empty to
   run the minimum required services.

That's it! You have successfully started the services using the specified tooling.
