import { action, computed } from  'mobx';

class Later<T extends ([] | {}), K extends keyof T> {
    get: () => T[K];
    set: (value: T[K]) => void;

    constructor(target: T, key: K) {
        const enclosedGetter = computed(() => target[key]);

        this.get = () => enclosedGetter.get();

        this.set = action((value: T[K]) => {
            target[key] = value;
        });
    }
}

type LaterType<Result extends any> = {
    get: () => Result;
    set: (x: Result) => void;
};

export const later = <T extends ([] | {}), K extends keyof T>(target: T, key: K): Later<T, K> =>
    new Later(target, key) as LaterType<T[K]>;

export const isLater = (x: any): x is LaterType<any> => x instanceof Later;

export type { LaterType as Later };
