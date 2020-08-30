import React from 'react';
import { observer } from 'mobx-react';
import { Later, isLater } from '../utils/later';

const SimpleEach = <
    Item extends any,
    ValidList extends Item[],
>(p: {
    value: ValidList;
    render: (item: Item, index: number) => JSX.Element;
}) => {
    const r = (p.value || []).map((item, index) => p.render(item, index));
    return <>{r}</>;
}

const LaterEach = observer(<
    Item extends any,
    ValidList extends Item[],
>(p: {
    value: Later<ValidList>;
    render: (item: Item, index: number) => JSX.Element;
}) => {
    const r = (p.value.get() || []).map((item, index) => p.render(item, index))
    return <>{r}</>;
});

export const Each = <
    Item extends any,
    ValidList extends Item[],
>(p: {
    value: Later<ValidList> | ValidList;
    render: (item: Item, index: number) => JSX.Element;
}) => isLater(p.value)
    ? <LaterEach value={p.value} render={p.render} />
    : <SimpleEach value={p.value} render={p.render} />;
