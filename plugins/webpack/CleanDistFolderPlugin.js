const fs = require('fs');
const path = require('path');

class CleanDistFolderPlugin {
  constructor(options = {}) {
    this.distPath = options.distPath || 'dist';
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('CleanDistFolderPlugin', (params, callback) => {
      const folderPath = path.resolve(compiler.context, this.distPath);

      // Check if folder exists
      if (fs.existsSync(folderPath)) {
        // Delete folder recursively
        this.deleteFolderRecursive(folderPath);
        console.log(`Deleted contents of '${folderPath}' before webpack build.`);
      } else {
        console.log(`Folder '${folderPath}' does not exist. Skipping deletion.`);
      }

      callback();
    });
  }

  deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file, index) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
}

module.exports = CleanDistFolderPlugin;
