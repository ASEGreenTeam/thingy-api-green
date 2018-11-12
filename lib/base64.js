const fs = require('fs');
const path = require('path');

const Base64 = function Base64() {

  this.ensureDirectoryExistence = function (filePath) {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  this.encode = function (file) {
    let data = fs.readFileSync(file);
    return new Buffer(data).toString('base64');
  }

  this.decode = function (base64str, file) {
    let data = new Buffer.from(base64str, 'base64');
    this.ensureDirectoryExistence(file);
    fs.writeFileSync(file, data);
    console.log(`File ${file} written!`);
  }
};

module.exports = new Base64();
