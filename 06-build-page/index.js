const fs = require('fs');
const promises = require('fs').promises;
const path = require('path');
const pathStyles = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'style.css');
async function recreateDirectory(direc) {
  try {
    await fs.access(direc);
    await fs.rm(direc, { recursive: true });
  } catch (err) {
    console.log('create folder');
  }
}
async function copyFiles(folder, copyFile) {
  try {
    const files = await promises.readdir(folder);
    await Promise.all(
      files.map(async (file) => {
        const fileStats = await promises.stat(path.join(folder, file));
        if (fileStats.isFile()) {
          await promises.copyFile(
            path.join(folder, file),
            path.join(copyFile, file),
          );
        } else {
          await recreateDirectory(path.join(copyFile, file));
          await create(path.join(copyFile, file));
          await copyFiles(path.join(folder, file), path.join(copyFile, file));
        }
      }),
    );
    console.log('Files copied successfully.');
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}
async function create(direc) {
  try {
    await fs.mkdir(direc, { recursive: true }, (err) => {
      if (err) console.log(err);
    });
    console.log('create');
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
  }
}

async function css(pathStyles, filePath) {
  try {
    await fs.createWriteStream(filePath);
    await fs.readdir(pathStyles, (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach(async (file) => {
          if (path.extname(file) === '.css') {
            const readStream = await fs.createReadStream(
              path.join(pathStyles, file),
              {
                encoding: 'utf8',
              },
            );
            readStream.on('data', async (chunk) => {
              await fs.writeFile(
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
    console.log('CSS files appended successfully.');
  } catch (err) {
    console.error('Error appending CSS files:', err.message);
  }
}
////////////////////////////////////////////////////////////////////////
async function copy() {
  await recreateDirectory(path.join(__dirname, 'project-dist'));
  await create(path.join(__dirname, 'project-dist'));
  await recreateDirectory(path.join(__dirname, 'project-dist', 'assets'));
  await create(path.join(__dirname, 'project-dist', 'assets'));
  await copyFiles(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
  await css(pathStyles, filePath);
  await createHtml();
}
copy();
async function createHtml() {
  try {
    const readStream = await fs.createReadStream(
      path.join(__dirname, 'template.html'),
      { encoding: 'utf8' },
    );
    readStream.on('data', async (chunk) => {
      //   process.stdout.write(chunk);
      await fs.readdir(
        path.join(__dirname, 'components'),
        async (err, files) => {
          if (err) console.log(err);
          else {
            await files.forEach(async (file) => {
              if (path.extname(file) === '.html') {
                const readStream = await fs.createReadStream(
                  path.join(__dirname, 'components', file),
                  {
                    encoding: 'utf8',
                  },
                );
                /////////////////////////////////////////////////////////////////////
                readStream.on('data', async (text) => {
                  chunk = chunk
                    .toString()
                    .replace(
                      `{{${path.basename(
                        path.join(__dirname, 'components', file),
                        '.html',
                      )}}}`,
                      text,
                    );
                  const way = path.join(
                    __dirname,
                    'project-dist',
                    'index.html',
                  );
                  if (!chunk.includes('{{') && !chunk.includes('}}')) {
                    await fs.createWriteStream(way);
                    await fs.writeFile(
                      way,
                      chunk,
                      { encoding: 'utf8', flag: 'a' },
                      (err) => {
                        if (err) {
                          console.error('Error writing to file:', err);
                        } else {
                          console.log('I have done this task');
                        }
                      },
                    );
                  }
                });
              }
            });
          }
        },
      );
      //   process.stdout.write(chunk);
    });
  } catch (err) {
    console.log(err);
  }
}
