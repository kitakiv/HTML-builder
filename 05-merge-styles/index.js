const fs = require('fs');
const path = require('path');
const pathStyles = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(filePath);

fs.readdir(pathStyles, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        const readStream = fs.createReadStream(path.join(pathStyles, file), {
          encoding: 'utf8',
        });
        readStream.on('data', (chunk) => {
          fs.writeFile(
            filePath,
            chunk,
            { encoding: 'utf8', flag: 'a' },
            (err) => {
              if (err) {
                console.error('Error writing to file:', err);
              }
            },
          );
        });
      }
    });
  }
});
