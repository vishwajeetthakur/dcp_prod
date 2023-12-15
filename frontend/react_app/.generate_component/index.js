#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const chalkAnimation = require('chalk-animation');
const figlet = require('figlet');
const { createSpinner } = require('nanospinner');

const { existsSync, mkdirSync, readdirSync } = require('fs');
const { dirname } = require('path');
const {
  createFolder,
  createComponent,
  createPage,
} = require('./.create_component/index.js');

// @ts-ignore
const currentPath = __dirname;
const projectRoot = dirname(currentPath);

let parentDir;
let selectedDir;
let componentName = process.argv.slice(2)[0];
let suggestedName;
let isPage = false;

const mkdirIfNone = async (srcpath) => {
  if (!existsSync(srcpath)) {
    console.clear();
    const answers = await inquirer.prompt({
      name: 'is_make_new',
      type: 'confirm',
      message: `It looks like ${chalk.bold.cyan(
        srcpath
      )} doesn't exist yet. Do you want to create this directory?`,
    });

    if (answers.is_make_new) {
      mkdirSync(srcpath, { recursive: true });
    } else {
      await selectParentDir();
    }
  }
};

const welcome = async () => {
  console.clear();
  const msg = 'Generate Component';

  figlet(msg, { font: 'Small' }, (_err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.clear();
};

const checkIsPage = async () => {
  console.clear();
  const answers = await inquirer.prompt({
    name: 'page_level',
    type: 'list',
    message: `Do you want to create a ${chalk.bold.greenBright(
      'Basic'
    )} or ${chalk.bold.yellowBright('Page')} level component?`,
    choices: ['Basic', 'Page'],
  });

  if (answers.page_level == 'Page') {
    isPage = true;
  }
};

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== '__snapshots__')
    .map((dirent) => source + '/' + dirent.name);

const flatten = (lists) => lists.reduce((a, b) => a.concat(b), []);

const getDirectoriesRecursive = (srcpath) => {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
};

const selectParentDir = async () => {
  console.clear();
  const answers = await inquirer.prompt({
    name: 'selected_dir',
    type: 'input',
    message: `Which ${chalk.bold.magenta(
      'parent directory'
    )} path do you want to put this component in?`,
    default() {
      return isPage ? 'src/components/pages' : 'src/components/common';
    },
  });

  parentDir = answers.selected_dir;
  await mkdirIfNone(parentDir);
};

const selectDir = async () => {
  console.clear();
  const directories = getDirectoriesRecursive(parentDir);

  const answers = await inquirer.prompt({
    name: 'selected_dir',
    type: 'list',
    message: `From the ${chalk.bold.magenta(
      'parent directory'
    )}, ${chalk.bold.cyan('where do you want the component to go?')}`,
    choices: directories,
    default() {
      return directories[0];
    },
  });

  selectedDir = answers.selected_dir;
};

const suggestName = async () => {
  console.clear();
  const answers = await inquirer.prompt({
    name: 'selected_name',
    type: 'list',
    message: `${chalk.bold.red(
      componentName
    )} is not the best name for a component. Would you like to try ${chalk.bold.yellowBright(
      suggestedName
    )} instead?`,
    choices: [suggestedName, componentName],
    default() {
      return suggestedName;
    },
  });

  if (answers.selected_name === suggestedName) {
    componentName = suggestedName;
  }
};

const checkComponentName = async (name) => {
  if (/^[a-z]/.test(name.trim()) || /\s/g.test(name)) {
    const nameSplit = name.trim().split(' ');
    const formatName = (nameArr) => {
      return nameArr
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
    };
    suggestedName = formatName(nameSplit);
    await suggestName();
  }
};

const handleComponentName = async (component_name) => {
  if (component_name) {
    componentName = component_name.trim();
    await checkComponentName(componentName);
  } else {
    nameAttempts = nameAttempts + 1;
    await getComponentName();
  }
};

let nameAttempts = 0;

const getComponentName = async () => {
  console.clear();
  const answers = await inquirer.prompt({
    name: 'component_name',
    type: 'input',
    message: `What should the ${chalk.bold.greenBright('component name')} be?${
      nameAttempts ? ' (Please enter a valid name)' : ''
    }`,
    default() {
      return componentName;
    },
  });

  await handleComponentName(answers.component_name);
};

const sleep = async (ms = 1200) => new Promise((r) => setTimeout(r, ms));

const handleRestart = async () => {
  const answers = await inquirer.prompt({
    name: 'selected_restart',
    type: 'list',
    message: `What would you like to do?`,
    choices: ['Restart', 'Change component name', 'Quit'],
    default() {
      return 'Change component name';
    },
  });

  const option = answers.selected_restart;

  if (option === 'Restart') {
    await runScript(1);
  } else if (option === 'Change component name') {
    await runScript(2);
  } else {
    process.exit();
  }
};

const handleVerify = async (is_ok) => {
  console.clear();
  const spinner = createSpinner(
    `Generating ${chalk.bold.greenBright(componentName)} in ${chalk.bold.cyan(
      selectedDir
    )}...`
  ).start();

  const path = selectedDir + `/${componentName}`;
  if (is_ok && !existsSync(path)) {
    createFolder(path);

    const nestedLevel = selectedDir.split('/').length;

    if (!isPage) {
      createComponent({ path, name: componentName, nestedLevel });
    } else {
      createPage({ path, name: componentName, nestedLevel });
    }

    await sleep();
    await sleep();

    spinner.success({
      text: `${projectRoot.replace(
        parentDir,
        ''
      )}${selectedDir}/${componentName}`,
    });
    const success = chalkAnimation.rainbow(
      'Congratulations you just made a new component!'
    );
    await sleep();
    success.stop();
  } else if (existsSync(path)) {
    spinner.error({ text: 'A component with that name already exists' });
    handleRestart();
  } else {
    spinner.error({ text: 'Something you noticed was a little off...' });
    handleRestart();
  }
};

const verify = async () => {
  console.clear();
  const answers = await inquirer.prompt({
    name: 'is_ok',
    type: 'confirm',
    message: `Your ${chalk.bold.greenBright(
      componentName
    )} component will be generated in ${chalk.bold.cyan(
      selectedDir
    )}, does that sound right?`,
  });

  handleVerify(answers.is_ok);
};

const runScript = async (step) => {
  if (!step) {
    await welcome();
    await checkIsPage();
    await selectParentDir();
    await selectDir();
    await getComponentName();
    await verify();
  } else if (step === 1) {
    await checkIsPage();
    await selectParentDir();
    await selectDir();
    await getComponentName();
    await verify();
  } else if (step === 2) {
    await getComponentName();
    await verify();
  }
};

runScript(0);
