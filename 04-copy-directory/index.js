const fs = require('fs').promises;
const path = require('path');
async function recreateDirectory(direc) {
  try {
    await fs.access(direc);
    await fs.rm(direc, { recursive: true });
  } catch (err) {
    console.log('create folder');
  }
}
async function copyFiles() {
  try {
    const files = await fs.readdir(path.join(__dirname, 'files'));
    await Promise.all(
      files.map(async (file) => {
        await fs.copyFile(
          path.join(__dirname, 'files', file),
          path.join(__dirname, 'files-copy', file)
        );
      }),
    );
    console.log('Files copied successfully.');
  } catch (err) {
    console.error('Error copying files:', err.message);
  }
}
async function create(direc) {
  try {
    await fs.mkdir(direc, { recursive: true });
    console.log('create');
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
  }
}
async function copy() {
  await recreateDirectory(path.join(__dirname, 'files-copy'));
  await create(path.join(__dirname, 'files-copy'));
  await copyFiles();
}
copy();
