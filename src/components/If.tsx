import React from 'react';
import { observer } from 'mobx-react';
import { Later } from '../utils/later';

const SimpleIf = (p: {
    value: any;
    children?: JSX.Element;
}) => p.value ? (p.children || null) : null;

const LaterIf = observer((p: {
    value: Later<any, any>;
    children?: JSX.Element;
}) => p.value.get() ? (p.children || null) : null);

export const If = (p: {
    value: Later<any, any> | any;
    children?: JSX.Element;
}) => p.value instanceof Later
    ? <LaterIf value={p.value}>{p.children}</LaterIf>
    : <SimpleIf value={p.value}>{p.children}</SimpleIf>;
