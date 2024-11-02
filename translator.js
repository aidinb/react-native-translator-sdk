const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
let translations = {};
const getKeyFromText = textValue => {
  // Your transformation logic here ...
  return textValue;
};
const processFile = async filePath => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const ast = babel.parse(content, {
      filename: filePath,
      presets: ['@babel/preset-react', '@babel/preset-typescript']
    });
    traverse(ast, {
      JSXElement(path) {
        if (path.node.openingElement.name.name === 'Text') {
          const textNode = path.node.children.find(child => child.type === 'JSXText');
          if (textNode) {
            const text = textNode.value.trim();
            const key = getKeyFromText(text);
            translations[key] = `${text}`;
            textNode.value = `{translations['${key}']}`;
          }
        }
      }
    });
    const {
      code
    } = generator(ast, {}, content);
    await fs.writeFile(filePath, code);
  } catch (error) {
    console.error(`Error processing file ${filePath}: `, error);
  }
};
const processDirectory = async directory => {
  const files = await fs.readdir(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = await fs.lstat(fullPath);
    if (stat.isDirectory()) {
      // Skip node_modules directory
      if (file !== 'node_modules') {
        await processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.js')) {
      await processFile(fullPath);
    }
  }
};
const run = async () => {
  await processDirectory('./');
  await fs.writeFile('en.js', `export default ${JSON.stringify(translations, null, 2)};`);
};
run().catch(console.error);