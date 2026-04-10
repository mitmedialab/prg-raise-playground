// Recalculates the path filters for the dynamic CircleCI configuration
// Usage: node .circleci/refresh-path-filters.mjs
// Then copy the output into the CircleCI config files
// See https://circleci.com/docs/using-dynamic-configuration/
// See https://github.com/circle-makotom/circle-advanced-setup-workflow

type WorkflowMeta = {
    filename: string;
    displayName: string;
}

// BEGIN CONFIGURATION

const pathsFilterAction = 'dorny/paths-filter@v2';

const mainWorkflowMeta: WorkflowMeta = {
    filename: 'ci-cd.yml',
    displayName: 'CI/CD',
};

function getWorkspaceWorkflowMeta(workspace: Workspace): WorkflowMeta {
    return {
        filename: `workspace-${workspace.yamlName}.yml`,
        displayName: `${workspace.name} (placeholder)`,
    };
}

// END CONFIGURATION

import {exec} from 'child_process';
import fs from 'fs';
import {promisify} from 'util';
import path from 'path';

const execAsync = promisify(exec);

enum DependencyType {
    Dependencies = 'dependencies',
    DevDependencies = 'devDependencies',
    PeerDependencies = 'peerDependencies'
}

type PackageJson = {
    name: string;
    location: string;
    dependencies: {[name: string]: string};
    devDependencies: {[name: string]: string};
    peerDependencies: {[name: string]: string};
};

type Workspace = {
    name: string;
    location: string;
    yamlName: string;
    dependencies: string[];
    devDependencies: string[];
    peerDependencies: string[];
    deepDependencies: string[];
};

type WorkspaceMap = {[name: string]: Workspace}
type WorkspaceList = Workspace[];

const workspaceTemplate = fs.readFileSync(path.join(__dirname, 'workspace-template.yml'), 'utf8');

/**
 * Calculate dependencies between workspaces in this repository.
 * @param workspaces The result of `npm query .workspace`.
 * @param depTypes The dependency types to include in the calculation.
 * @returns A map of workspace names to their dependencies.
 */
function calculateDependencies(workspaces: Array<PackageJson>, depTypes: DependencyType[]): WorkspaceMap {
    const workspaceNames = workspaces.map(workspace => workspace.name);
    const dependencies = workspaces.reduce((bag, workspace) => {
        const workspaceEntry = depTypes.reduce((workspaceDeps, depType) => {
            const deps = workspace[depType];
            workspaceDeps[depType] = deps ? Object.keys(deps).filter(dep => workspaceNames.includes(dep)) : [];
            return workspaceDeps;
        }, <Workspace>({name: workspace.name}));
        workspaceEntry.location = workspace.location;
        workspaceEntry.yamlName = path.basename(workspace.location).replace(/@/g, '').replace(/[/.]/g, '-');
        bag[workspace.name] = workspaceEntry;
        return bag;
    }, <WorkspaceMap>({}));
    console.log('Calculating deep dependencies...');
    const addDeepDependencies = (deepDependencies: string[], workspaceName: string, depType: DependencyType) => {
        const depDeps = dependencies[workspaceName][depType] || [];
        for (let dep of depDeps) {
            if (deepDependencies.includes(dep)) {
                continue;
            }
            deepDependencies.push(dep);
            addDeepDependencies(deepDependencies, dep, depType);
        }
    };
    for (let workspace of workspaces) {
        const deepDependencies = dependencies[workspace.name].deepDependencies = [workspace.name];
        for (let depType of depTypes) {
            addDeepDependencies(deepDependencies, workspace.name, depType);
        }
    }
    return dependencies;
};

/**
 * Sort workspaces in dependency order.
 * @param workspaces The workspace map to sort.
 * @returns The workspaces sorted in dependency order.
 */
function sortWorkspaces(workspaces: WorkspaceMap): WorkspaceList {
    // TODO: is this reliable? Do we need a full topo sort?
    const sortedWorkspaces = Object.values(workspaces).sort((a, b) => {
        if (a.deepDependencies.includes(b.name)) {
            return 1;
        }
        if (b.deepDependencies.includes(a.name)) {
            return -1;
        }
        return 0;
    });
    return sortedWorkspaces;
}

async function generateWorkflow(sortedWorkspaces: WorkspaceList, workspaces: WorkspaceMap): Promise<void> {
    let workflowFileHandle: fs.promises.FileHandle | undefined;
    let workflowStream: fs.WriteStream | undefined;
    try {
        workflowFileHandle = await fs.promises.open(path.join('.github', 'workflows', mainWorkflowMeta.filename), 'w');
        workflowStream = workflowFileHandle.createWriteStream();
        workflowStream.write([
            `name: ${mainWorkflowMeta.displayName}`,
            '',
            'on:',
            '  push:',
            '  workflow_dispatch:',
            '',
            'concurrency:',
            '  group: "${{ github.workflow }} @ ${{ github.event.pull_request.head.label || github.head_ref || github.ref }}"',
            '  cancel-in-progress: true',
            '',
            'jobs:',
        ].join('\n') + '\n');

        generateChangesJob(workflowStream, sortedWorkspaces, workspaces);

        generateCalls(workflowStream, sortedWorkspaces, workspaces);
    } finally {
        workflowStream?.end();
        workflowStream?.close();
        await workflowFileHandle?.close();
    }
}

function generateChangesJob(workflowStream: fs.WriteStream, sortedWorkspaces: WorkspaceList, workspaces: WorkspaceMap) {
    workflowStream.write([
        '  changes:',
        '    name: Detect affected workspaces',
        '    runs-on: ubuntu-latest',
        '    outputs:',
    ].join('\n') + '\n');
    for (let workspace of sortedWorkspaces) {
        workflowStream.write(`      ${workspace.yamlName}: \${{ steps.filter.outputs.${workspace.yamlName} }}\n`);
    }
    workflowStream.write([
        '    steps:',
        '      - uses: actions/checkout@v4 # TODO: skip this for PRs',
        `      - uses: ${pathsFilterAction}`,
        '        id: filter',
        '        with:',
        '          filters: |',
        '            any-workspace:',
        '              - ".github/workflows/workspace-*.yml"',
        '              - "workspaces/**"',
    ].join('\n') + '\n');
    for (let workspace of sortedWorkspaces) {
        workflowStream.write([
            `            ${workspace.yamlName}:`,
            `              - ".github/workflows/workspace-${workspace.yamlName}.yml"`,
        ].join('\n') + '\n');
        for (let dep of workspace.deepDependencies.sort()) {
            workflowStream.write(`              - "${workspaces[dep].location}/**"\n`);
        }
    }
    workflowStream.write([
        "      - if: ${{ steps.filter.outputs.any-workspace == 'true' }}",
        '        uses: actions/setup-node@v3',
        '        with:',
        '          cache: npm',
        '          node-version-file: .nvmrc',
        "      - if: ${{ steps.filter.outputs.any-workspace == 'true' }}",
        '        uses: ./.github/actions/install-dependencies',
    ].join('\n') + '\n');
}

function generateCalls(workflowStream: fs.WriteStream, sortedWorkspaces: WorkspaceList, workspaces: WorkspaceMap) {
    for (let workspace of sortedWorkspaces) {
        workflowStream.write([
            `  ${workspace.yamlName}:`,
            `    uses: ./.github/workflows/workspace-${workspace.yamlName}.yml`,
            // By default, this job will only run if the jobs it 'needs' have succeeded.
            // Instead, run even if some of those are skipped, but not if they failed or if the workflow was cancelled.
            `    if: \${{ !failure() && !cancelled() && needs.changes.outputs.${workspace.yamlName} == 'true' }}`,
            '    needs:',
            '      - changes',
        ].join('\n') + '\n');
        const deps = workspace.deepDependencies;
        for (let dep of deps.sort()) {
            if (dep == workspace.name) continue;
            workflowStream.write(`      - ${workspaces[dep].yamlName}\n`);
        }
    }
}

async function generateWorkspaceWorkflow(workspace: Workspace): Promise<void> {
    const workflowMeta = getWorkspaceWorkflowMeta(workspace);
    const workflowPath = path.join('.github', 'workflows', workflowMeta.filename);
    if (fs.existsSync(workflowPath)) {
        console.log(`Not overwriting existing workflow: ${workflowMeta.filename}`);
        return;
    }
    let workflowFileHandle: fs.promises.FileHandle | undefined;
    try {
        workflowFileHandle = await fs.promises.open(workflowPath, 'w');
        const workspaceWorkflow = workspaceTemplate
            .replace(/WS_NAME/g, workspace.name)
            .replace(/WS_LOCATION/g, workspace.location);
        workflowFileHandle.write(Buffer.from(workspaceWorkflow, 'utf8'));
    } finally {
        workflowFileHandle?.close();
    }
}

const main = async () => {
    console.log('Querying workspaces...');
    const packages = JSON.parse((await execAsync('npm query .workspace')).stdout) as Array<PackageJson>;
    console.log('Calculating dependencies...');
    const workspaces = calculateDependencies(packages, [DependencyType.Dependencies]);
    console.log('Sorting modules in dependency order...');
    const sortedWorkspaces = sortWorkspaces(workspaces);
    console.log('Generating main workflow...');
    fs.mkdirSync(path.join('.github', 'workflows'), {recursive: true});
    await generateWorkflow(sortedWorkspaces, workspaces);
    console.log('Generating stub workflows for workspaces...');
    for (let workspace of sortedWorkspaces) {
        await generateWorkspaceWorkflow(workspace);
    }
};

main().then(
    () => {
        console.log('Done.');
        process.exitCode = 0;
    },
    e => {
        console.error(e);
        process.exitCode = 1;
    }
);
