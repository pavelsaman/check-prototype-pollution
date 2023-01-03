const process = require('process');

const args = process.argv;

const stringWithPrototypePollution = '{"__proto__":{"test":123}}';
const functionPatterns = [
  {
    fnct: function (totest, badString) {
      return totest(JSON.parse(badString));
    },
    sig: 'function (badJson)',
  },
  {
    fnct: function (totest, badString) {
      return totest(JSON.parse(badString), {});
    },
    sig: 'function (badJson, {})',
  },
  {
    fnct: function (totest, badString) {
      return totest({}, JSON.parse(badString));
    },
    sig: 'function ({}, badJson)',
  },
  {
    fnct: function (totest, badString) {
      return totest(JSON.parse(badString), JSON.parse(badString));
    },
    sig: 'function (badJson, badJson)',
  },
  {
    fnct: function (totest, badString) {
      return totest({}, {}, JSON.parse(badString));
    },
    sig: 'function ({}, {}, badJson)',
  },
  {
    fnct: function (totest, badString) {
      return totest({}, {}, {}, JSON.parse(badString));
    },
    sig: 'function ({}, {}, {}, badJson)',
  },
  {
    fnct: function (totest) {
      return totest({}, "__proto__.test", "123");
    },
    sig: 'function ({}, badPath, value)',
  },
  {
    fnct: function (totest) {
      return totest({}, "__proto__[test]", "123");
    },
    sig: 'function ({}, badPath, value)',
  },
  {
    fnct: function (totest) {
      return totest("__proto__.test", "123");
    },
    sig: 'function (badPath, value)',
  },
  {
    fnct: function (totest) {
      return totest("__proto__[test]", "123");
    },
    sig: 'function (badPath, value)',
  },
  {
    fnct: function (totest) {
      totest({}, "__proto__", "test", "123");
    },
    sig: 'function ({}, badString, badString, value)',
  },
  {
    fnct: function (totest) {
      return totest("__proto__", "test", "123");
    },
    sig: 'function (badString, badString, value)',
  },
  {
    fnct: function (totest, badString) {
      return totest(badString);
    },
    sig: 'function (badString)',
  },
];

function getLibFromArgs(args) {
  const argvIndexWithLibrary = 2;
  let importedLib = null;

  try {
    importedLib = require(args[argvIndexWithLibrary]);
  } catch (e) {
    console.log(`Cannot import "${args[argvIndexWithLibrary]}" library. Check it's installed.`);
  }

  return {
    name: args[argvIndexWithLibrary],
    lib: importedLib,
  };
}

function getLibFunctions(lib) {
  const libFunctions = [];

  for (const key in lib) {
    if (!lib.hasOwnProperty(key)) continue;

    if (typeof lib[key] === 'function') {
      libFunctions.push(key);
    }
  }

  return libFunctions;
}

function testFunctions(fnct, sig, name, totest) {
  let parsedObject = null;
  
  try {
    parsedObject = fnct(totest, stringWithPrototypePollution);
  } catch (e) {}

  if (parsedObject && parsedObject.test) {
    console.log(`func: ${name}, sig: ${sig} is vulnerable!`);
  }
}

function run() {
  const { lib, name: libName } = getLibFromArgs(args);
  for (const fnct of getLibFunctions(lib)) {
    for (const p in functionPatterns) {
      if (functionPatterns.hasOwnProperty(p)) {
        testFunctions(functionPatterns[p].fnct, functionPatterns[p].sig, `${libName}.${fnct}`, lib[fnct]);
      }
    }
  }
}

run();
