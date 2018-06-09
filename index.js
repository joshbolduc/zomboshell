#!/usr/bin/env node

/**
 * Why `zomboshell` instead of something shorter?
 * Unfortunately, `zsh` was taken.
 */

const readline = require('readline');
const supportsColor = require('supports-color');

const { ZomboShell } = require('./zombo');

const colorPrompt = {
  partial: '\x1b[32m>\x1b[0m ',
  full:
    '\x1b[31mz\x1b[33mo\x1b[34mm\x1b[35mb\x1b[36mo\x1b[0m \x1b[32m$\x1b[0m ',
};
const noColorPrompt = {
  partial: '> ',
  full: 'zombo $ ',
};

const useColor = process.argv.reduce((use, arg) => {
  if (arg === '--no-color') {
    return false;
  }
  if (arg === '--color') {
    return true;
  }

  return use;
}, supportsColor.stdout.hasBasic);

const promptTexts = useColor ? colorPrompt : noColorPrompt;

function createInterface() {
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  interface.on('SIGINT', handleSigint);
  interface.on('SIGCONT', handleSigcont);
  interface.on('line', handleLine);
  interface.on('close', handleClose);

  return interface;
}

function prompt(printEmptyLine) {
  if (printEmptyLine) {
    console.log();
  }

  rl.setPrompt(shell.getPromptText());
  rl.prompt();
}

function promptWithFeedback() {
  console.log(shell.getNextLine());
  prompt();
}

function handleSigint() {
  if (shell.hasPartialCommand()) {
    shell.abortPartialCommand();
    prompt(true);
  } else {
    rl.close();
  }
}

function handleSigcont() {
  rl.prompt(true);
}

function handleLine(line) {
  if (shell.processCommand(line)) {
    promptWithFeedback();
  } else {
    prompt();
  }
}

function handleClose() {
  if (shell.hasPartialCommand()) {
    shell.abortPartialCommand();
    rl = createInterface();

    prompt(true);
  } else {
    console.log();
    process.exit(0);
  }
}

const shell = new ZomboShell(promptTexts.full, promptTexts.partial);
let rl = createInterface();
promptWithFeedback();
