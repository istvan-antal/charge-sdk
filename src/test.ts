import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

export const test = () => {
    spawnSync('npm', ['audit'], { stdio: 'inherit', shell: true });
    if (existsSync(resolve(process.cwd(), 'tslint.json'))) {
        spawnSync('tslint', ['-c', 'tslint.json', '-p', 'tsconfig.json'], { stdio: 'inherit', shell: true });
    }
};