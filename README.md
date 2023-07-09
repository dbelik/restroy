# Restroy

## Overview

Restroy is a platform that saves your time by optimizing your routine tasks. It makes boring
tasks, such as sending emails, managing your annoying Jira tickets and so on.

## Commands

| Description                             | Command                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| Run all database migrations and seeding | `docker compose run database-migration-tool`                                            |
| Create database migration               | `docker compose run database-migration-tool create -seq  -digits 10 -ext sql <example>` |
