import { action, computed } from  'mobx';

export class Later<R> {
    get: () => R;

    set: (x: R) => void;

    constructor(
        target: {} | [],
        key: string | number | symbol,
    ) {
        const c = computed(() => target[key]);
        this.get = () => c.get() as unknown as R;
        this.set = action((x: R) => {
            target[key] = x;
        });
    }
}

export const later = <T extends ([] | {}), K extends keyof T>(target: T, key: K): {
    get: () => T[K];
} => new Later<T[K]>(target, key);

export const isLater = (x: any): x is Later<any, any, any> => x instanceof Later;
