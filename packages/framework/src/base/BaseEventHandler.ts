import type { ClientEvents } from 'discord.js';
import type { Logger } from 'pino';
import type { BaseConfig } from '../types';
import { eventNameToDiscordEvent } from '../utils';

/**
 * Base class for all Discord event handlers in the framework.
 * Provides common functionality, dependency injection, and auto-event derivation.
 */
export abstract class BaseEventHandler<T extends keyof ClientEvents = keyof ClientEvents> {
    protected logger: Logger;
    protected config: BaseConfig;

    protected constructor(logger: Logger, config: BaseConfig) {
        this.logger = logger;
        this.config = config;
    }

    /**
     * The Discord event name this handler listens to.
     * If not provided, it will be auto-derived from the class name.
     * For example, 'ReadyEvent' becomes 'ready'.
     */
    readonly event?: T;

    /**
     * Gets the Discord event name, auto-deriving from class name if not explicitly set.
     */
    get eventName(): T {
        return (this.event ?? eventNameToDiscordEvent(this.constructor.name)) as T;
    }

    /**
     * Whether this event handler should only run once.
     * Defaults to false (runs every time the event is emitted).
     */
    readonly once?: boolean = false;

    /**
     * Main execution method for the event handler.
     * This is where the event handling logic should be implemented.
     *
     * @param args - The arguments passed by Discord.js for this event type
     */
    abstract execute(...args: ClientEvents[T]): Promise<void> | void;

    /**
     * Hook called before event execution.
     * Use for validation, permission checks, etc.
     */
    protected async beforeExecute?(...args: ClientEvents[T]): Promise<void>;

    /**
     * Hook called after successful event execution.
     * Use for cleanup, logging, analytics, etc.
     */
    protected async afterExecute?(...args: ClientEvents[T]): Promise<void>;

    /**
     * Hook called when event execution throws an error.
     * Use for error handling, logging, recovery, etc.
     */
    protected async onError?(error: Error, ...args: ClientEvents[T]): Promise<void>;

    /**
     * Validates event handler configuration.
     * Called during event handler registration.
     */
    protected validateHandler?(): void;
}
