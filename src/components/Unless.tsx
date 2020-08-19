import React from 'react';
import { observer } from 'mobx-react';
import { Later } from '../utils/later';

const SimpleUnless = (p: {
    value: any;
    children?: JSX.Element;
}) => p.value ? null : (p.children || null);

const LaterUnless = observer((p: {
    value: Later<any, any>;
    children?: JSX.Element;
}) => p.value.get() ? null : (p.children || null));

export const Unless = (p: {
    value: Later<any, any> | any;
    children?: JSX.Element;
}) => p.value instanceof Later
    ? <LaterUnless value={p.value}>{p.children}</LaterUnless>
    : <SimpleUnless value={p.value}>{p.children}</SimpleUnless>;
