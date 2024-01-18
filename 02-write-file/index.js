const readline = require('node:readline');
const { stdin: input, stdout: output, stdout } = require('node:process');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({ input, output });
const filePath = path.join(__dirname, 'yourtext.txt');
const writeStream = fs.createWriteStream(filePath);
stdout.write('Hello!!! try to write your text \n');
rl.on('line', (input) => {
  if (input.toString().trim().toLowerCase() === 'exit') {
    close();
  } else {
    fs.writeFile(filePath, input, { encoding: 'utf8', flag: 'a' }, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
  }
});
rl.on('SIGINT', () => {
  close();
});
function close() {
  stdout.write('Good bye!!!');
  rl.close();
}
