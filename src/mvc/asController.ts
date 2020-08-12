type ControllerData = {
    path?: string;
    name?: string;
    data?: {
        [key: string]: any;
    };
};

const Controllers = new Map<{ new(); }, ControllerData>();

export const asController = (data: ControllerData = {}) => {
    return (target: { new(); }) => {
        Controllers.set(target, data);
    };
};

asController.controllers = Controllers;
