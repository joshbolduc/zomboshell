const parser = require('bash-parser');

const script = [
  'Welcome to ZomboShell',
  'This is ZomboShell',
  'Welcome',
  'This is ZomboShell. Welcome to ZomboShell',
  'You can do anything with ZomboShell',
  'Anything at all',
  'The only limit is yourself',
  'Welcome',
  'to ZomboShell',
  'Welcome',
  'to ZomboShell',
  'This is ZomboShell',
  'Welcome to ZomboShell',
  'This is ZomboShell! Welcome!',
  'Yes... this is ZomboShell',
  'This is ZomboShell, and welcome to you, who have run ZomboShell',
  'Anything is possible with ZomboShell',
  'You can do anything with ZomboShell',
  'The infinite is possible with ZomboShell',
  'The unattainable is unknown with ZomboShell',
  'Welcome to ZomboShell',
  'This is ZomboShell',
  'Welcome to ZomboShell',
  'Welcome',
  'This is ZomboShell',
  'Welcome to ZomboShell!',
  'Welcome to ZomboShell',
];

class ZomboShell {
  constructor(fullPromptText, partialPromptText) {
    this.scriptIndex = 0;
    this.partialCommand = '';
    this.fullPromptText = fullPromptText;
    this.partialPromptText = partialPromptText;
  }

  abortPartialCommand() {
    this.partialCommand = '';
  }

  hasPartialCommand() {
    return !!this.partialCommand;
  }

  getPromptText() {
    return this.hasPartialCommand()
      ? this.partialPromptText
      : this.fullPromptText;
  }

  getNextLine() {
    const oldIndex = this.scriptIndex;
    this.scriptIndex = (this.scriptIndex + 1) % script.length;
    return script[oldIndex];
  }

  processCommand(command) {
    try {
      parser(`${this.partialCommand}${command}`);
    } catch (e) {
      if (e.toString().includes("Unexpected 'EOF'")) {
        this.partialCommand += `\n${command}`;
        return false;
      }
    }

    this.partialCommand = '';

    return true;
  }
}

module.exports = {
  ZomboShell,
};
