
# Gemini's Project Memory

This file contains my understanding of the `robo-cord-framework` project. I will use this as a reference to ensure my contributions are consistent with the project's goals, architecture, and conventions.

## Project Overview

The project is a Discord bot framework designed for enterprise-level applications. It follows a convention-over-configuration philosophy and is structured as a monorepo.

### Key Architectural Features:

*   **Monorepo:** The project is a monorepo with a `packages/framework` and multiple `apps/*` for testing and demonstration.
*   **Two-App Architecture:** Each bot consists of a `BotApp` for real-time interaction and a `WorkerApp` for background jobs.
*   **Database:** PostgreSQL with TypeORM.
*   **Queue System:** `pg-boss` for background job processing.
*   **Dependency Injection:** `TSyringe` is used for dependency injection.
*   **Configuration:** A Zod-based, type-safe configuration system.
*   **Auto-Discovery:** The framework automatically discovers and registers commands, events, and jobs based on file-based conventions.
*   **Middleware:** A decorator-based middleware pipeline for slash commands.

## Development Workflow

1.  **Framework Development:** Changes are made in `packages/framework`.
2.  **Testing:** Changes are tested using the `apps/example-bot`.
3.  **Hot Reloading:** The development server supports hot reloading for commands, jobs, and events.
4.  **Publishing:** The framework is intended to be published as a private package to GitHub Package Registry.

## My Role

My primary role is to assist in the development of the framework and the example bot applications. I will adhere to the existing architectural patterns, coding style, and conventions. I will use the information in the project documentation to guide my work.

