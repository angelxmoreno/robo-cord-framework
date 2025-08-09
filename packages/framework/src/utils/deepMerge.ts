// Simple deep merge utility
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
        if (Object.hasOwn(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (
                sourceValue &&
                typeof sourceValue === 'object' &&
                targetValue &&
                typeof targetValue === 'object' &&
                !Array.isArray(sourceValue) &&
                !Array.isArray(targetValue)
            ) {
                result[key] = deepMerge(
                    targetValue as Record<string, unknown>,
                    sourceValue as Record<string, unknown>
                ) as T[Extract<keyof T, string>];
            } else if (sourceValue !== undefined) {
                result[key] = sourceValue as T[Extract<keyof T, string>];
            }
        }
    }

    return result;
}
