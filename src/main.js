var
  async = require('async'),
  color = require('cli-color'),
  config = require('./config.json'),
  fs = require('fs'),
  request = require('request'),
  timelog = require('./timelog');

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = function (task, options) {
    var logFileName = getUserHome() + '/' + config.filename;

    //console.log(task, options);

    var time = (new Date()).toISOString();

    fs.appendFile(logFileName, time + '\t' + task + '\n', function (err) {
        if (err) throw err;

        console.log("Done");
    });
};
