import { computed } from  'mobx';

export class Later<T extends ([] | {}), K extends keyof T, Res = T[K]> {
    get: () => Res;

    constructor(
        target: T,
        key: K,
    ) {
        const c = computed(() => target[key]);
        this.get = () => c.get() as unknown as Res;
    }
}

export const later = <T extends ([] | {}), K extends keyof T>(target: T, key: K): {
    get: () => T[K];
} => new Later(target, key);

export const isLater = (x: any): x is Later<any, any, any> => x instanceof Later;
