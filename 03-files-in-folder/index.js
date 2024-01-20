const fs = require('node:fs');
const path = require('path');
fs.readdir(path.join(__dirname, '//secret-folder'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, '//secret-folder', file), (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          if (stats.isFile()) {
            console.log(
              `${file.split('.')[0]} - ${path
                .extname(path.join(__dirname, '//secret-folder', file))
                .replace('.', '')} - ${`${parseFloat(stats.size) / 1024}kb`}`,
            );
          }
        }
      });
    });
  }
});
