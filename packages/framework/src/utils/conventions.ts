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
 *
 * @example
 * commandNameToId("PingCommand") // "ping"
 * commandNameToId("UserInfoCommand") // "user-info"
 * commandNameToId("ManageServerCommand") // "manage-server"
 */
export function commandNameToId(className: string): string {
    // Remove "Command" suffix and convert PascalCase to kebab-case
    const nameWithoutSuffix = className.replace(/Command$/, '');
    return pascalToKebab(nameWithoutSuffix);
}

/**
 * Converts a job class name to a job identifier.
 * @param className - The class name (e.g., "WelcomeJob")
 * @returns The job identifier (e.g., "welcome")
 *
 * @example
 * jobNameToId("WelcomeJob") // "welcome"
 * jobNameToId("ProcessDataJob") // "process-data"
 * jobNameToId("SendNotificationJob") // "send-notification"
 */
export function jobNameToId(className: string): string {
    // Remove "Job" suffix and convert PascalCase to kebab-case
    const nameWithoutSuffix = className.replace(/Job$/, '');
    return pascalToKebab(nameWithoutSuffix);
}

/**
 * Converts an event class name to a Discord event name.
 * @param className - The class name (e.g., "MessageCreateEvent")
 * @returns The Discord event name (e.g., "messageCreate")
 *
 * @example
 * eventNameToDiscordEvent("MessageCreateEvent") // "messageCreate"
 * eventNameToDiscordEvent("GuildJoinEvent") // "guildJoin"
 * eventNameToDiscordEvent("ReadyEvent") // "ready"
 */
export function eventNameToDiscordEvent(className: string): string {
    // Remove "Event" suffix and convert to camelCase
    const nameWithoutSuffix = className.replace(/Event$/, '');
    return pascalToCamel(nameWithoutSuffix);
}

/**
 * Converts an entity class name to a TypeORM table name.
 * @param className - The class name (e.g., "UserEntity")
 * @returns The table name (e.g., "User")
 *
 * @example
 * entityNameToTableName("UserEntity") // "User"
 * entityNameToTableName("GuildSettingsEntity") // "GuildSettings"
 * entityNameToTableName("CommandUsageEntity") // "CommandUsage"
 */
export function entityNameToTableName(className: string): string {
    // Remove "Entity" suffix, keep PascalCase
    return className.replace(/Entity$/, '');
}

/**
 * Converts PascalCase to kebab-case.
 * @param str - The PascalCase string
 * @returns The kebab-case string
 *
 * @example
 * pascalToKebab("UserInfo") // "user-info"
 * pascalToKebab("ManageServer") // "manage-server"
 * pascalToKebab("Ping") // "ping"
 */
export function pascalToKebab(str: string): string {
    return str
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
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
