import { describe, expect, it } from 'bun:test';
import {
    camelToPascal,
    commandNameToId,
    entityNameToTableName,
    eventNameToDiscordEvent,
    jobNameToId,
    kebabToPascal,
    pascalToCamel,
    pascalToKebab,
    validateClassName,
} from '../packages/framework/src/utils/conventions';

describe('conventions utilities', () => {
    describe('commandNameToId', () => {
        it('should convert valid command names correctly', () => {
            expect(commandNameToId('PingCommand')).toBe('ping');
            expect(commandNameToId('UserInfoCommand')).toBe('user-info');
            expect(commandNameToId('ManageServerCommand')).toBe('manage-server');
        });

        it('should throw error for invalid command names', () => {
            expect(() => commandNameToId('InvalidClass')).toThrow(
                'Invalid command class name: "InvalidClass". Command classes must end with "Command".'
            );
            expect(() => commandNameToId('Command')).toThrow(
                'Invalid command class name: "Command". Cannot be just "Command".'
            );
            expect(() => commandNameToId('')).toThrow(
                'Invalid command class name: "". Command classes must end with "Command".'
            );
        });
    });

    describe('jobNameToId', () => {
        it('should convert valid job names correctly', () => {
            expect(jobNameToId('WelcomeJob')).toBe('welcome');
            expect(jobNameToId('ProcessDataJob')).toBe('process-data');
            expect(jobNameToId('SendNotificationJob')).toBe('send-notification');
        });

        it('should throw error for invalid job names', () => {
            expect(() => jobNameToId('InvalidClass')).toThrow(
                'Invalid job class name: "InvalidClass". Job classes must end with "Job".'
            );
            expect(() => jobNameToId('Job')).toThrow('Invalid job class name: "Job". Cannot be just "Job".');
        });
    });

    describe('eventNameToDiscordEvent', () => {
        it('should convert valid event names correctly', () => {
            expect(eventNameToDiscordEvent('MessageCreateEvent')).toBe('messageCreate');
            expect(eventNameToDiscordEvent('GuildJoinEvent')).toBe('guildJoin');
            expect(eventNameToDiscordEvent('ReadyEvent')).toBe('ready');
        });

        it('should throw error for invalid event names', () => {
            expect(() => eventNameToDiscordEvent('InvalidClass')).toThrow(
                'Invalid event class name: "InvalidClass". Event classes must end with "Event".'
            );
            expect(() => eventNameToDiscordEvent('Event')).toThrow(
                'Invalid event class name: "Event". Cannot be just "Event".'
            );
        });
    });

    describe('entityNameToTableName', () => {
        it('should convert valid entity names correctly', () => {
            expect(entityNameToTableName('UserEntity')).toBe('User');
            expect(entityNameToTableName('GuildSettingsEntity')).toBe('GuildSettings');
            expect(entityNameToTableName('CommandUsageEntity')).toBe('CommandUsage');
        });

        it('should throw error for invalid entity names', () => {
            expect(() => entityNameToTableName('InvalidClass')).toThrow(
                'Invalid entity class name: "InvalidClass". Entity classes must end with "Entity".'
            );
            expect(() => entityNameToTableName('Entity')).toThrow(
                'Invalid entity class name: "Entity". Cannot be just "Entity".'
            );
        });
    });

    describe('pascalToKebab', () => {
        it('should convert PascalCase to kebab-case correctly', () => {
            expect(pascalToKebab('UserInfo')).toBe('user-info');
            expect(pascalToKebab('ManageServer')).toBe('manage-server');
            expect(pascalToKebab('Ping')).toBe('ping');
        });

        it('should handle acronyms correctly', () => {
            expect(pascalToKebab('HTMLParser')).toBe('html-parser');
            expect(pascalToKebab('XMLHttpRequest')).toBe('xml-http-request');
            expect(pascalToKebab('HTTPSConnection')).toBe('https-connection');
            expect(pascalToKebab('JSONData')).toBe('json-data');
        });

        it('should handle numbers correctly', () => {
            expect(pascalToKebab('API2Response')).toBe('api2-response');
            expect(pascalToKebab('Version3Parser')).toBe('version3-parser');
            expect(pascalToKebab('HTTP2Client')).toBe('http2-client');
        });

        it('should handle edge cases', () => {
            expect(pascalToKebab('A')).toBe('a');
            expect(pascalToKebab('AB')).toBe('ab');
            expect(pascalToKebab('ABC')).toBe('abc');
            expect(pascalToKebab('ABc')).toBe('a-bc');
        });
    });

    describe('pascalToCamel', () => {
        it('should convert PascalCase to camelCase correctly', () => {
            expect(pascalToCamel('MessageCreate')).toBe('messageCreate');
            expect(pascalToCamel('GuildJoin')).toBe('guildJoin');
            expect(pascalToCamel('Ready')).toBe('ready');
        });
    });

    describe('camelToPascal', () => {
        it('should convert camelCase to PascalCase correctly', () => {
            expect(camelToPascal('messageCreate')).toBe('MessageCreate');
            expect(camelToPascal('guildJoin')).toBe('GuildJoin');
            expect(camelToPascal('ready')).toBe('Ready');
        });
    });

    describe('kebabToPascal', () => {
        it('should convert kebab-case to PascalCase correctly', () => {
            expect(kebabToPascal('user-info')).toBe('UserInfo');
            expect(kebabToPascal('manage-server')).toBe('ManageServer');
            expect(kebabToPascal('ping')).toBe('Ping');
        });
    });

    describe('validateClassName', () => {
        it('should validate command class names correctly', () => {
            expect(validateClassName('PingCommand', 'Command')).toBe(true);
            expect(validateClassName('UserInfoCommand', 'Command')).toBe(true);
            expect(validateClassName('InvalidName', 'Command')).toBe(false);
            expect(validateClassName('Command', 'Command')).toBe(false);
        });

        it('should validate job class names correctly', () => {
            expect(validateClassName('WelcomeJob', 'Job')).toBe(true);
            expect(validateClassName('ProcessDataJob', 'Job')).toBe(true);
            expect(validateClassName('InvalidName', 'Job')).toBe(false);
        });

        it('should validate entity class names correctly', () => {
            expect(validateClassName('UserEntity', 'Entity')).toBe(true);
            expect(validateClassName('GuildSettingsEntity', 'Entity')).toBe(true);
            expect(validateClassName('InvalidName', 'Entity')).toBe(false);
        });

        it('should validate event class names correctly', () => {
            expect(validateClassName('MessageCreateEvent', 'Event')).toBe(true);
            expect(validateClassName('ReadyEvent', 'Event')).toBe(true);
            expect(validateClassName('InvalidName', 'Event')).toBe(false);
        });
    });
});
