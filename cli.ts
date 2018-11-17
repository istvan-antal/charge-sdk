#!/usr/bin/env node
import { build } from './src/build';
import { run } from './run';
import { create } from './src/create';
import { test } from './src/test';

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