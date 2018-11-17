import { spawnSync } from 'child_process';

spawnSync('npm', ['version', 'patch', '-m', '[Release] %s'], { stdio: 'inherit', shell: true });
spawnSync('npm', ['publish'], { stdio: 'inherit', shell: true });
spawnSync('git', ['push'], { stdio: 'inherit', shell: true });
spawnSync('git', ['push', '--tags'], { stdio: 'inherit', shell: true });