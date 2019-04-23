import { spawnSync } from 'child_process';

const result = spawnSync('npm', ['version', 'patch', '-m', '"[Release] %s"'], { stdio: 'inherit', shell: true });
if (result.status !== 0) {
    process.exit(1);
}
spawnSync('npm', ['publish'], { stdio: 'inherit', shell: true });
spawnSync('git', ['push'], { stdio: 'inherit', shell: true });
spawnSync('git', ['push', '--tags'], { stdio: 'inherit', shell: true });