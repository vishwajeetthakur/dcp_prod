const nameToClass = (name) => {
  return name
    .split('')
    .map((letter, i) => {
      const isCapital = /^[A-Z]*$/.test(letter);
      const isFirst = i === 0;
      const localLetter = letter.toLowerCase();

      return isCapital && !isFirst ? `-${localLetter}` : localLetter;
    })
    .join('');
};

const formatNestedPath = (nestedLevel) => {
  return [...Array(nestedLevel).keys()].map(() => '..').join('/');
};

// component.tsx
const component = (name, nestedLevel) => `// Packages
import React from 'react';

// Components

// Hooks

// Utils

// Types

// Styles
import './${name}.scss';

const ${name} = () => {
  // ==============================================
  // Hooks
  // ==============================================

  // =============================================
  // State/Refs
  // =============================================

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================

  // =============================================
  // Interaction Handlers
  // =============================================

  // =============================================
  // Render Methods
  // =============================================

  // =============================================
  // Effects
  // =============================================

  // =============================================
  // Return
  // =============================================
  return (
    <div className={\`${nameToClass(name)} \${className}\`}>
      Hello, I am a ${name} component.
    </div>
  );
};

export default ${name};
`;

// page.js
const page = (name, nestedLevel) => `// Packages
import React, { useEffect } from 'react';

// Components

// Hooks

// Utils

// Types

// Styles
import './${name}.scss';

const ${name} = () => {
  // ==============================================
  // Hooks
  // ==============================================

  // =============================================
  // State/Refs
  // =============================================

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================

  // =============================================
  // Interaction Handlers
  // =============================================

  // =============================================
  // Render Methods
  // =============================================

  // =============================================
  // Effects
  // =============================================

  // =============================================
  // Return
  // =============================================
  return (
    <div className="${nameToClass(name)}">
      <h1>Locations</h1>
      <p>Hello, I am the ${name} page.</p>
    </div>
  );
};

export default ${name};
`;

// component.scss
const style = (name, nestedLevel) => `.${nameToClass(name)} {} `;


// index.ts
const barrel = (name) => `import ${name} from './${name}';

export default ${name};
`;

module.exports = { component, style, barrel, page };
