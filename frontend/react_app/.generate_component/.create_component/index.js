const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const prettier = require('prettier');
const {
  component,
  style,
  barrel,
  page,
} = require('./.component_templates.js');

const createFolder = (dir) => {
  if (existsSync(dir))
    throw new Error('A component with that name already exists.');
  mkdirSync(dir);
};

const getParentPath = (path, name) => {
  const nameRegex = new RegExp(name, 'g');
  return path.replace(nameRegex, '');
};

const parentIndexData = (path, name) => {
  const parentPath = getParentPath(path, name);

  if (!existsSync(`${parentPath}index.js`)) {
    return '';
  }

  return readFileSync(`${parentPath}index.js`, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    return data;
  });
};

const updateParentIndex = (path, name) => {
  const indexData = parentIndexData(path, name);

  // Imports
  const currentImports =
    indexData.match(
      /import([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])/gm
    ) || [];
  const newImport = `import ${name} from './${name}'`;

  // Exports
  const currentExports = indexData.match(/(export {[^}]*}|default .*)/gm) || [];
  const exportItems = currentExports.reduce((acc, exp) => {
    const components = exp
      .replace(/(\{|}|export|default|;)/gm, '')
      .split(',')
      .filter(Boolean);
    acc.push(...components.map((comp) => comp.trim()));
    return acc;
  }, []);
  const newExports = [name, ...exportItems].sort().filter(item => item).join(`,\n`);

  // Format final import/export statements + file content
  const importStatements = [newImport, ...currentImports].sort().join(`;\n`);
  const exportStatement = `export {\n${newExports}\n}`;

  const fileContent = `${importStatements}\n\n${exportStatement}`;

  return prettier.format(fileContent, {
    parser: 'typescript',
    trailingComma: 'es5',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
  });
};

const createComponent = ({ path, name, nestedLevel }) => {
  function fileWriteCallback(err) {
    if (err) throw err;
    prettier();
  }
  const parentPath = getParentPath(path, name);
  // component.tsx
  writeFileSync(
    `${path}/${name}.js`,
    component(name, nestedLevel),
    fileWriteCallback
  );
  // component.scss
  writeFileSync(
    `${path}/${name}.scss`,
    style(name, nestedLevel),
    fileWriteCallback
  );
  // index.tsx
  writeFileSync(`${path}/index.js`, barrel(name), fileWriteCallback);
  // insert new component into parent index.ts file
  writeFileSync(
    `${parentPath}index.js`,
    updateParentIndex(path, name),
    fileWriteCallback
  );
};

const createPage = ({ path, name, nestedLevel }) => {
  function fileWriteCallback(err) {
    if (err) throw err;
  }
  const parentPath = getParentPath(path, name);
  // component.tsx
  writeFileSync(
    `${path}/${name}.js`,
    page(name, nestedLevel),
    fileWriteCallback
  );
  // component.scss
  writeFileSync(
    `${path}/${name}.scss`,
    style(name, nestedLevel),
    fileWriteCallback
  );
  // index.tsx
  writeFileSync(`${path}/index.js`, barrel(name), fileWriteCallback);
  // insert new component into parent index.ts file
  writeFileSync(
    `${parentPath}index.js`,
    updateParentIndex(path, name),
    fileWriteCallback
  );
};

module.exports = { createFolder, createComponent, createPage };
