import React from 'react';
import { observer } from 'mobx-react';
import { Later } from '../utils/later';

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
    value: Later<any, any, ValidList>;
    render: (item: Item, index: number) => JSX.Element;
}) => {
    const r = (p.value.get() || []).map((item, index) => p.render(item, index))
    return <>{r}</>;
});

export const Each = <
    Item extends any,
    ValidList extends Item[],
>(p: {
    value: Later<any, any, ValidList> | ValidList;
    render: (item: Item, index: number) => JSX.Element;
}) => p.value instanceof Later
    ? <LaterEach value={p.value} render={p.render} />
    : <SimpleEach value={p.value} render={p.render} />;
