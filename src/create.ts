import { prompt } from 'inquirer';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';
import {
    appTsxTemplate, reduxIndexTsxTemplate, indexTsxTemplate,
    indexHtmlTemplate, actionsIndexTsx, reducersIndexTsx,
    storeIndexTsx,
} from './templates';

export const create = () => {
    let name: string;
    let features: string[];
    prompt({
        name: 'name',
        type: 'input',
        validate: value => !!value,
    }).then(async result => {
        // tslint:disable-next-line:no-any
        name = (result as any).name as string;

        return prompt({
            name: 'features',
            type: 'checkbox',
            default: ['tslint'],
            choices: [
                {
                    value: 'tslint',
                    name: 'TSLint',
                },
                {
                    value: 'redux',
                    name: 'Redux',
                },
            ],
        // tslint:disable-next-line:no-shadowed-variable
        }).then(result => {
            // tslint:disable-next-line:no-any
            features = (result as any).features as string[];
        });
    }).then(() => {
        const projectDir = resolve(process.cwd(), name);
        const hasRedux = features.includes('redux');
        const hasTslint = features.includes('tslint');

        mkdirSync(name);
        spawnSync('npm',['init', '-y'], {
            cwd: projectDir,
            stdio: 'inherit',
            shell: true,
        });

        const packageJsonPath = resolve(projectDir, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
        packageJson.main = './src/index.tsx';
        packageJson.scripts.start = 'charge-sdk run';
        packageJson.scripts.build = 'charge-sdk build';

        if (hasTslint) {
            packageJson.scripts = 'charge-sdk test';
        }

        // tslint:disable-next-line:no-null-keyword no-magic-numbers
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));

        spawnSync('npm', ['install', 'charge-sdk', 'react', 'react-dom', '@types/react', '@types/react-dom'], {
            cwd: projectDir,
            stdio: 'inherit',
            shell: true,
        });

        if (hasRedux) {
            spawnSync('npm', ['install', 'redux', 'react-redux', '@types/react-redux'], {
                cwd: projectDir,
                stdio: 'inherit',
                shell: true,
            });
        }

        mkdirSync(resolve(projectDir, 'src'));
        writeFileSync(resolve(projectDir, 'src/App.tsx'), appTsxTemplate);
        writeFileSync(resolve(projectDir, 'src/index.tsx'), hasRedux ? reduxIndexTsxTemplate : indexTsxTemplate);
        writeFileSync(resolve(projectDir, 'src/index.html'), indexHtmlTemplate);

        if (hasRedux) {
            mkdirSync(resolve(projectDir, 'src/actions'));
            mkdirSync(resolve(projectDir, 'src/reducers'));
            mkdirSync(resolve(projectDir, 'src/store'));
            writeFileSync(resolve(projectDir, 'src/actions/index.tsx'), actionsIndexTsx);
            writeFileSync(resolve(projectDir, 'src/reducers/index.tsx'), reducersIndexTsx);
            writeFileSync(resolve(projectDir, 'src/store/index.tsx'), storeIndexTsx);
        }

        if (hasTslint) {
            writeFileSync(
                resolve(projectDir, 'tslint.json'),
                readFileSync(resolve(__dirname, '..', 'tslint.json').toString()),
            );
        }

        console.log('Project created, run the following command to get started!');
        console.log(`cd ${name}; npm start`);
    }).catch(error => {
        console.error(error);
        throw error;
    });
};