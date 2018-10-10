const Fs = require('fs');

Fs.readdirSync(__dirname).forEach(function (file) {
    if (file === 'index.js'
    || file.substr(file.lastIndexOf('.') + 1) !== 'js') {
        return;
    }
    var name = file.substr(0, file.indexOf('.'));
    nameToUpper = name.charAt(0).toUpperCase() + name.slice(1);
    exports[nameToUpper] = require('./' + name);
});

