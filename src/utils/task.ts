type TaskData = {
    silent?: boolean;
    preventOverlap?: boolean;
};

const generateId = () => 'task::' + Array(8).fill(0).map(() => Math.random().toString(36).substr(2, 9)).join(':');

const tasks: Array<{ id: number; target: object; key: string; name: string; data: TaskData; }> = [];

export const task = (name: string, data: TaskData = {}) => {
    return (target: object, key: string, descriptor: PropertyDescriptor) => {
        console.log('[TASK] register', name, '->', target.constructor.name, '::', key);

        const fn = descriptor.value!;

        descriptor.value = function(...args: any[]) {
            console.log('[TASK] start', name);
            return Promise.resolve(fn.apply(target, args))
                .then(arg => {
                    console.log('[TASK] success', name);
                    return arg;
                })
                .catch(e => {
                    console.log('[TASK] error', name);
                    if (!data.silent) {
                        return Promise.reject(e);
                    }
                });
        }
    };
};

task.collection = tasks;
