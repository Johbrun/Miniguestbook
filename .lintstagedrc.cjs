// Run ESLint + Prettier on staged files, inside the right project so the
// flat ESLint config and its plugins resolve correctly.
const path = require('path');

function inProject(project, files) {
  const rel = files.map((f) => JSON.stringify(path.relative(project, f))).join(' ');
  return [`bash -c "cd ${project} && eslint --fix ${rel} && prettier --write ${rel}"`];
}

module.exports = {
  'backend/**/*.ts': (files) => inProject('backend', files),
  'frontend/**/*.{ts,tsx,css}': (files) => inProject('frontend', files),
};
