export * from './types';
export * from './validator';
export * from './utils';
export * from './constants';
export * from './error';
export * from './card';

export function tsEach<T>(obj: T, callback: (value: T[keyof T], key: keyof T) => void) {
    for (const key in obj) {
        callback(obj[key as keyof T], key as keyof T);
    }
}
export async function tsForin<T>(obj: T, fn: (value: T[keyof T], key: keyof T) => Promise<void>) {
    for (const key in obj) {
        await fn(obj[key as keyof T], key as keyof T);
    }
}