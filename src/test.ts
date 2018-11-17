import { spawnSync } from 'child_process';

export const test = () => {
    spawnSync('npm', ['audit'], { stdio: 'inherit', shell: true });
    spawnSync('tslint', ['-c', 'tslint.json', '-p', 'tsconfig.json'], { stdio: 'inherit', shell: true });
};