/* eslint-disable no-console */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Command } = require('@oclif/command');
const { get } = require('lodash');
const { createBasicStructure, createAPI, createWebDashboard } = require('./util');
const { cli } = require('cli-ux');

class MynewcliCommand extends Command {
  async run() {
    try {
      cli.action.start('Working, Please wait...');
      // get args
      const { args } = this.parse(MynewcliCommand);
      const configFilePath = get(args, 'filePath', null);
      const codePath = `${__dirname}/../code`;
      console.log('Creating basic structure...');
      const basicErr = await createBasicStructure({ codePath, configFilePath });
      if (basicErr) return cli.action.stop(basicErr);
      console.log('Creating API...');
      const apiError = await createAPI({ codePath, configFilePath });
      if (apiError) return cli.action.stop(apiError);
      console.log('Creating WebDashboard...');
      const webError = await createWebDashboard({ codePath, configFilePath });
      if (webError) return cli.action.stop(webError);
      console.log('Starting processes...');
      await exec(
        'osascript -e \'tell app "Terminal" to do script "cd ~/Desktop/Yo/mynewcli/code/API && ns"\''
      );
      await exec(
        'osascript -e \'tell app "Terminal" to do script "cd ~/Desktop/Yo/mynewcli/code/WebDashboard && ns"\''
      );

      cli.action.stop();
    } catch (error) {
      console.log(error, '!!!!!!!!!!!!!');
      cli.action.stop();
    }
  }
}

MynewcliCommand.args = [{ name: 'filePath', required: true }];

module.exports = MynewcliCommand;

// {
//   "events": {
//     "start": "echo \"\\x1Bc\""
//   }
// }
