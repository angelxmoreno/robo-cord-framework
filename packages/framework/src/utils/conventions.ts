/**
 * Naming convention utilities for converting between class names and identifiers.
 * Used throughout the framework for consistent naming patterns.
 *
 * Conventions:
 * - Commands: PingCommand -> "ping", UserInfoCommand -> "user-info"
 * - Jobs: WelcomeJob -> "welcome", ProcessDataJob -> "process-data"
 * - Events: MessageCreateEvent -> "messageCreate", GuildJoinEvent -> "guildJoin"
 * - Entities: UserEntity -> "User", GuildSettingsEntity -> "GuildSettings"
 */

/**
 * Converts a command class name to a command identifier.
 * @param className - The class name (e.g., "PingCommand")
 * @returns The command identifier (e.g., "ping")
 * @throws Error if the className doesn't end with "Command"
 *
 * @example
 * commandNameToId("PingCommand") // "ping"
 * commandNameToId("UserInfoCommand") // "user-info"
 * commandNameToId("ManageServerCommand") // "manage-server"
 */
export function commandNameToId(className: string): string {
    if (!className.endsWith('Command')) {
        throw new Error(`Invalid command class name: "${className}". Command classes must end with "Command".`);
    }

    // Remove "Command" suffix using slice (more explicit and safe)
    const nameWithoutSuffix = className.slice(0, -'Command'.length);

    if (nameWithoutSuffix.length === 0) {
        throw new Error(`Invalid command class name: "${className}". Cannot be just "Command".`);
    }

    return pascalToKebab(nameWithoutSuffix);
}

/**
 * Converts a job class name to a job identifier.
 * @param className - The class name (e.g., "WelcomeJob")
 * @returns The job identifier (e.g., "welcome")
 * @throws Error if the className doesn't end with "Job"
 *
 * @example
 * jobNameToId("WelcomeJob") // "welcome"
 * jobNameToId("ProcessDataJob") // "process-data"
 * jobNameToId("SendNotificationJob") // "send-notification"
 */
export function jobNameToId(className: string): string {
    if (!className.endsWith('Job')) {
        throw new Error(`Invalid job class name: "${className}". Job classes must end with "Job".`);
    }

    // Remove "Job" suffix using slice (more explicit and safe)
    const nameWithoutSuffix = className.slice(0, -'Job'.length);

    if (nameWithoutSuffix.length === 0) {
        throw new Error(`Invalid job class name: "${className}". Cannot be just "Job".`);
    }

    return pascalToKebab(nameWithoutSuffix);
}

/**
 * Converts an event class name to a Discord event name.
 * @param className - The class name (e.g., "MessageCreateEvent")
 * @returns The Discord event name (e.g., "messageCreate")
 * @throws Error if the className doesn't end with "Event"
 *
 * @example
 * eventNameToDiscordEvent("MessageCreateEvent") // "messageCreate"
 * eventNameToDiscordEvent("GuildJoinEvent") // "guildJoin"
 * eventNameToDiscordEvent("ReadyEvent") // "ready"
 */
export function eventNameToDiscordEvent(className: string): string {
    if (!className.endsWith('Event')) {
        throw new Error(`Invalid event class name: "${className}". Event classes must end with "Event".`);
    }

    // Remove "Event" suffix using slice (more explicit and safe)
    const nameWithoutSuffix = className.slice(0, -'Event'.length);

    if (nameWithoutSuffix.length === 0) {
        throw new Error(`Invalid event class name: "${className}". Cannot be just "Event".`);
    }

    return pascalToCamel(nameWithoutSuffix);
}

/**
 * Converts an entity class name to a TypeORM table name.
 * @param className - The class name (e.g., "UserEntity")
 * @returns The table name (e.g., "User")
 * @throws Error if the className doesn't end with "Entity"
 *
 * @example
 * entityNameToTableName("UserEntity") // "User"
 * entityNameToTableName("GuildSettingsEntity") // "GuildSettings"
 * entityNameToTableName("CommandUsageEntity") // "CommandUsage"
 */
export function entityNameToTableName(className: string): string {
    if (!className.endsWith('Entity')) {
        throw new Error(`Invalid entity class name: "${className}". Entity classes must end with "Entity".`);
    }

    // Remove "Entity" suffix using slice (more explicit and safe)
    const nameWithoutSuffix = className.slice(0, -'Entity'.length);

    if (nameWithoutSuffix.length === 0) {
        throw new Error(`Invalid entity class name: "${className}". Cannot be just "Entity".`);
    }

    return nameWithoutSuffix;
}

/**
 * Converts PascalCase to kebab-case.
 * Handles acronyms and numbers correctly.
 * @param str - The PascalCase string
 * @returns The kebab-case string
 *
 * @example
 * pascalToKebab("UserInfo") // "user-info"
 * pascalToKebab("ManageServer") // "manage-server"
 * pascalToKebab("Ping") // "ping"
 * pascalToKebab("HTMLParser") // "html-parser"
 * pascalToKebab("XMLHttpRequest") // "xml-http-request"
 * pascalToKebab("API2Response") // "api2-response"
 */
export function pascalToKebab(str: string): string {
    return (
        str
            // Insert hyphen before uppercase letter that follows lowercase letter or digit
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            // Insert hyphen before uppercase letter that is followed by lowercase letter (handles acronyms)
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            .toLowerCase()
    );
}

/**
 * Converts PascalCase to camelCase.
 * @param str - The PascalCase string
 * @returns The camelCase string
 *
 * @example
 * pascalToCamel("MessageCreate") // "messageCreate"
 * pascalToCamel("GuildJoin") // "guildJoin"
 * pascalToCamel("Ready") // "ready"
 */
export function pascalToCamel(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts camelCase to PascalCase.
 * @param str - The camelCase string
 * @returns The PascalCase string
 *
 * @example
 * camelToPascal("messageCreate") // "MessageCreate"
 * camelToPascal("guildJoin") // "GuildJoin"
 * camelToPascal("ready") // "Ready"
 */
export function camelToPascal(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts kebab-case to PascalCase.
 * @param str - The kebab-case string
 * @returns The PascalCase string
 *
 * @example
 * kebabToPascal("user-info") // "UserInfo"
 * kebabToPascal("manage-server") // "ManageServer"
 * kebabToPascal("ping") // "Ping"
 */
export function kebabToPascal(str: string): string {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

/**
 * Validates that a class name follows the expected naming convention.
 * @param className - The class name to validate
 * @param expectedSuffix - The expected suffix (e.g., "Command", "Job", "Event", "Entity")
 * @returns True if the class name follows the convention
 *
 * @example
 * validateClassName("PingCommand", "Command") // true
 * validateClassName("WelcomeJob", "Job") // true
 * validateClassName("InvalidName", "Command") // false
 */
export function validateClassName(className: string, expectedSuffix: string): boolean {
    if (!className.endsWith(expectedSuffix)) {
        return false;
    }

    // Check if the name without suffix is PascalCase
    const nameWithoutSuffix = className.replace(new RegExp(`${expectedSuffix}$`), '');
    return /^[A-Z][a-zA-Z0-9]*$/.test(nameWithoutSuffix);
}
