#!/usr/bin/env node

import boxen from 'boxen';
import chalk from 'chalk';

const data = {
  name: chalk.bold.red("Vinayak Vashisth (codeREDxbt)"),
  handle: chalk.white("@codeREDxbt"),
  work: chalk.white("Web3 x Fullstack Developer"),
  twitter: chalk.cyan("https://x.com/codeREDxbt"),
  github: chalk.cyan("https://github.com/codeREDxbt"),
  linkedin: chalk.cyan("https://linkedin.com/in/codeREDxbt"),
  web: chalk.cyan("https://coderedxbt.dev/"),
  npx: chalk.white("npx coderedxbt"),
  labelWork: chalk.white.bold("       Work:"),
  labelTwitter: chalk.white.bold("    Twitter:"),
  labelGitHub: chalk.white.bold("     GitHub:"),
  labelLinkedIn: chalk.white.bold("   LinkedIn:"),
  labelWeb: chalk.white.bold("        Web:"),
  labelCard: chalk.white.bold("       Card:")
};

const newline = '\n';
const heading = `${data.name} / ${data.handle}`;
const working = `${data.labelWork}  ${data.work}`;
const twittering = `${data.labelTwitter}  ${data.twitter}`;
const githubing = `${data.labelGitHub}  ${data.github}`;
const linkedining = `${data.labelLinkedIn}  ${data.linkedin}`;
const webing = `${data.labelWeb}  ${data.web}`;
const carding = `${data.labelCard}  ${data.npx}`;

const output = heading +
               newline + newline +
               working + newline +
               twittering + newline +
               githubing + newline +
               linkedining + newline +
               webing + newline + newline +
               carding;

console.log(chalk.green(boxen(output, {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'red',
})));
