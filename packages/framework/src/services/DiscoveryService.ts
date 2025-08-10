import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Logger } from 'pino';
import type { BaseConfig, ClassConstructor } from '../types';

type DiscoveryServiceOptions = {
    logger: Logger;
    config: BaseConfig;
};

// File patterns for different discovery types
const entityFileRegex = /Entity\.(ts|js)$/;
const commandFileRegex = /Command\.(ts|js)$/;
const jobFileRegex = /Job\.(ts|js)$/;
const eventFileRegex = /Event\.(ts|js)$/;

export class DiscoveryService {
    protected logger: Logger;
    protected config: BaseConfig;

    constructor({ logger, config }: DiscoveryServiceOptions) {
        this.logger = logger;
        this.config = config;
    }

    protected getFilesInDirectory(path: string, filePattern?: RegExp): string[] {
        this.logger.debug({ path, filePattern }, 'Reading directory');
        try {
            const files = readdirSync(path, { withFileTypes: true })
                .filter((dirent) => dirent.isFile())
                .map((dirent) => join(path, dirent.name));

            if (filePattern) {
                return files.filter((file) => filePattern.test(file));
            }
            return files;
        } catch (error) {
            this.logger.error({ path, error }, `Error reading directory`);
            return [];
        }
    }

    /**
     * Validates if an exported item is a valid entity class.
     */
    protected isValidEntity(exportedItem: unknown): exportedItem is ClassConstructor {
        return typeof exportedItem === 'function' && exportedItem.prototype && exportedItem.name.endsWith('Entity');
    }

    /**
     * Validates if an exported item is a valid command class.
     */
    protected isValidCommand(exportedItem: unknown): exportedItem is ClassConstructor {
        return typeof exportedItem === 'function' && exportedItem.prototype && exportedItem.name.endsWith('Command');
    }

    /**
     * Validates if an exported item is a valid job class.
     */
    protected isValidJob(exportedItem: unknown): exportedItem is ClassConstructor {
        return typeof exportedItem === 'function' && exportedItem.prototype && exportedItem.name.endsWith('Job');
    }

    /**
     * Validates if an exported item is a valid event class.
     */
    protected isValidEvent(exportedItem: unknown): exportedItem is ClassConstructor {
        return typeof exportedItem === 'function' && exportedItem.prototype && exportedItem.name.endsWith('Event');
    }

    /**
     * Discovers entity classes in the specified directory.
     * @returns Promise of discovered entity class constructors
     */
    async discoverEntities(): Promise<ClassConstructor[]> {
        const files = this.getFilesInDirectory(this.config.paths.entities, entityFileRegex);
        const entities: ClassConstructor[] = [];

        for (const file of files) {
            try {
                this.logger.debug({ file }, 'Loading entity file');

                // Dynamic import the module
                const module = await import(file);

                // Look for exported classes that look like entities
                Object.values(module).forEach((exportedItem: unknown) => {
                    if (this.isValidEntity(exportedItem)) {
                        this.logger.debug({ entityName: exportedItem.name }, 'Found entity');
                        entities.push(exportedItem);
                    }
                });
            } catch (error) {
                this.logger.warn({ file, error }, 'Failed to load entity file');
            }
        }

        return entities;
    }

    /**
     * Discovers command classes in the specified directory.
     * @returns Promise of discovered command class constructors
     */
    async discoverCommands(): Promise<ClassConstructor[]> {
        const files = this.getFilesInDirectory(this.config.paths.commands, commandFileRegex);
        const commands: ClassConstructor[] = [];

        for (const file of files) {
            try {
                this.logger.debug({ file }, 'Loading command file');

                // Dynamic import the module
                const module = await import(file);

                // Look for exported classes that look like commands
                Object.values(module).forEach((exportedItem: unknown) => {
                    if (this.isValidCommand(exportedItem)) {
                        this.logger.debug({ commandName: exportedItem.name }, 'Found command');
                        commands.push(exportedItem);
                    }
                });
            } catch (error) {
                this.logger.warn({ file, error }, 'Failed to load command file');
            }
        }

        return commands;
    }

    /**
     * Discovers job classes in the specified directory.
     * @returns Promise of discovered job class constructors
     */
    async discoverJobs(): Promise<ClassConstructor[]> {
        const files = this.getFilesInDirectory(this.config.paths.jobs, jobFileRegex);
        const jobs: ClassConstructor[] = [];

        for (const file of files) {
            try {
                this.logger.debug({ file }, 'Loading job file');

                // Dynamic import the module
                const module = await import(file);

                // Look for exported classes that look like jobs
                Object.values(module).forEach((exportedItem: unknown) => {
                    if (this.isValidJob(exportedItem)) {
                        this.logger.debug({ jobName: exportedItem.name }, 'Found job');
                        jobs.push(exportedItem);
                    }
                });
            } catch (error) {
                this.logger.warn({ file, error }, 'Failed to load job file');
            }
        }

        return jobs;
    }

    /**
     * Discovers event handler classes in the specified directory.
     * @returns Promise of discovered event class constructors
     */
    async discoverEvents(): Promise<ClassConstructor[]> {
        const files = this.getFilesInDirectory(this.config.paths.events, eventFileRegex);
        const events: ClassConstructor[] = [];

        for (const file of files) {
            try {
                this.logger.debug({ file }, 'Loading event file');

                // Dynamic import the module
                const module = await import(file);

                // Look for exported classes that look like events
                Object.values(module).forEach((exportedItem: unknown) => {
                    if (this.isValidEvent(exportedItem)) {
                        this.logger.debug({ eventName: exportedItem.name }, 'Found event');
                        events.push(exportedItem);
                    }
                });
            } catch (error) {
                this.logger.warn({ file, error }, 'Failed to load event file');
            }
        }

        return events;
    }
}
