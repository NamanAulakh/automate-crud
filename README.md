# automate-crud

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mynewcli.svg)](https://npmjs.org/package/mynewcli)
[![CircleCI](https://circleci.com/gh/NamanAulakh/mynewcli/tree/master.svg?style=shield)](https://circleci.com/gh/NamanAulakh/mynewcli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/mynewcli.svg)](https://npmjs.org/package/mynewcli)
[![License](https://img.shields.io/npm/l/mynewcli.svg)](https://github.com/NamanAulakh/mynewcli/blob/master/package.json)

# Prerequisites

- mongo must be up and running

# Usage

Config file should be a `.js` file and should look something like this:

<!---- [![config.js](https://github.com/NamanAulakh/automate-crud/blob/master/assets/config.png?raw=true) -->

```
module.exports = {
  name: 'dating-app',
  models: {
    User: {
      email: { type: 'String', default: '', unique: true, required: true },
      isVerified: { type: 'Boolean', default: false },
    },
    Vote: {
      isLiked: { type: 'Boolean', default: true },
      otherId: { type: 'String' },
      userId: { type: 'String' },
    },
    Profile: {
      userId: { type: 'String' },
      age: { type: 'Number' },
      name: { type: 'String' },
    },
  },
};
```

# Commands

Run `npm i && ./bin/run <path-to-the -config-file>` in the project root( might take 2 - 3 minutes ):

[![demo](https://github.com/NamanAulakh/automate-crud/blob/master/assets/1.gif?raw=true)

- Finally the generated code can be found in `code` directory in the project root.

# Roadmap

- Authentication
- Authorization
- Fill Nested Data as JSON
- Add ref/populate support in schema
- Web:boolean i/p box
- paramValidation
- provide db Freedom to user
- Allow users with options to customize the app
- Improve UI
- should be able to generate API and AdminPanel independently.


