// Safe deep merge utility that prevents prototype pollution
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        obj.constructor === Object &&
        Object.prototype.toString.call(obj) === '[object Object]'
    );
}

export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
        // Skip dangerous keys that could lead to prototype pollution
        if (DANGEROUS_KEYS.has(key) || !Object.hasOwn(source, key)) {
            continue;
        }

        const sourceValue = source[key];
        const targetValue = result[key];

        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
            (result as Record<string, unknown>)[key] = deepMerge(
                targetValue as Record<string, unknown>,
                sourceValue as Record<string, unknown>
            );
        } else if (sourceValue !== undefined) {
            (result as Record<string, unknown>)[key] = sourceValue;
        }
    }

    return result;
}
