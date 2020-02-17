#!/usr/bin/env node

import { run, create, build, test } from './index';

// tslint:disable-next-line:no-magic-numbers
switch (process.argv[2]) {
case 'run':
    run();
    break;
case 'create':
    create();
    break;
case 'test':
    test();
    break;
default:
    build();
    break;
}