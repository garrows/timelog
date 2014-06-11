var
    async = require('async'),
    color = require('cli-color'),
    config = require('./config.json'),
    fs = require('fs'),
    lazy = require('lazy'),
    moment = require('moment'),
    request = require('request'),
    timelog = require('./timelog');

var logFileName = getUserHome() + '/' + config.filename;

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var formatDate = function(date) {
    var m = moment.duration(date);
    return m.hours() + "h " + m.minutes() + "m ";
}

function report(task, options) {
    var startTime;
    var dates = {};
    var stream = fs.createReadStream(logFileName);

    new lazy(stream)
    .lines
    .forEach(function(lineBuffer){
        var line = lineBuffer.toString();
        var split = line.split('\t');
        var dateTime = new Date(split[0]);
        var date = new Date(split[0].split('T')[0]);

        if (dates[date] == undefined) {
            dates[date] = {
                timeWorked : 0,
                timeSlacked : 0,
                last : dateTime
            };
        } else {
            if (line.indexOf("**") === -1) {
                dates[date].timeWorked += dateTime - dates[date].last;
            } else {
                dates[date].timeSlacked += dateTime - dates[date].last;
            }
            dates[date].last = dateTime;
        }
    });

    stream.on('end', function() {
        var date = Object.keys(dates)[0];
        console.log(
            moment(date, "YYYY-MM-DD").format('dddd') + '\t' +
            formatDate(dates[date].timeWorked) + 'worked.\t\t' +
            formatDate(dates[date].timeSlacked) + 'slacked.'
            // moment.duration(dates[date].timeSlacked)
        );
    });
}

function log(task) {
    var time = (new Date()).toISOString();

    fs.appendFile(logFileName, time + '\t' + task + '\n', function (err) {
        if (err) throw err;
        console.log("Done");
    });
}

module.exports = function (task, options) {

    console.log(task, options);



    if (options.report) {
        report();
    } else {
        log(task, options);
    }
};
