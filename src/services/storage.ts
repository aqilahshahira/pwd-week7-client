export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readStoredValue<T>(
    key: string,
    isValid: (value: unknown) => value is T,
    fallback: T,
): T {
    const saved = localStorage.getItem(key);
    if (saved === null) return structuredClone(fallback);
    const value: unknown = JSON.parse(saved);
    if (!isValid(value)) throw new Error('Please check the data type');
    return value;
}