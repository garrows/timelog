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

var formatTimeDiff = function(diff) {
    var m = moment.duration(diff);
    return m.hours() + "h " + m.minutes() + "m ";
}

var getLastLine = function(callback) {
    fs.stat(logFileName, function(err, stat) {
        fs.open(logFileName, 'r', function(err, fd) {
            if(err) throw err;
            var i = 0;
            var line = '';
            var readPrevious = function(buf) {
                fs.read(fd, buf, 0, buf.length, stat.size-buf.length-i, function(err, bytesRead, buffer) {
                    if(err) throw err;
                    line = String.fromCharCode(buffer[0]) + line;
                    if (buffer[0] === 0x0a && line.length > 1) { //0x0a == '\n'
                        //console.log("getLastLine", line.length, line);
                        callback(null, line);
                    } else {
                        i++;
                        readPrevious(new Buffer(1));
                    }
                });
            }
            readPrevious(new Buffer(1));
        });
    });
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
        var activity = split.slice(1).join('\t');
        var dateTime = new Date(split[0]);
        var date = new Date(split[0]);
        var dateKey = date.toLocaleDateString();

        if (dates[dateKey] == undefined) {
            dates[dateKey] = {
                timeWorked : 0,
                timeSlacked : 0,
                last : dateTime
            };

            console.log(
                '----------------' +
                moment(dateKey, "dddd, MMMM DD YYYY").format('dddd') +
                '----------------'
            );

        } else {
            var timeDiff = dateTime - dates[dateKey].last;
            if (line.indexOf("**") === -1) {
                dates[dateKey].timeWorked += timeDiff;
            } else {
                dates[dateKey].timeSlacked += timeDiff;
            }
            console.log(
                formatTimeDiff(timeDiff) + '\t' +
                activity
            );
            dates[dateKey].last = dateTime;
        }
    });

    stream.on('end', function() {
        var dateKeys = Object.keys(dates);
        var totalTimeWorked = 0;
        var totalTimeSlacked = 0;
        console.log('========================================');
        for (var i = 0; i < dateKeys.length; i++) {
            var dateKey = dateKeys[i];
            console.log(
                moment(dateKey, "dddd, MMMM DD YYYY").format('ddd') + '\t' +
                formatTimeDiff(dates[dateKey].timeWorked) + 'worked.\t\t' +
                formatTimeDiff(dates[dateKey].timeSlacked) + 'slacked.'
                // moment.duration(dates[dateKey].timeSlacked)
            );
            totalTimeWorked += dates[dateKey].timeWorked;
            totalTimeSlacked += dates[dateKey].timeSlacked;
        }
        console.log('========================================');
        console.log(
            'Total:\t' +
            formatTimeDiff(totalTimeWorked) + 'worked.\t\t' +
            formatTimeDiff(totalTimeSlacked) + 'slacked.\n'
        );

    });
}

function log(task) {
    var time = new Date();

    getLastLine(function(err, line) {
        var lastDate = time;
        console.log('line', line);
        if (!err) {
            console.log('date', line.split('\t')[0].trim())
            lastDate = new Date(line.split('\t')[0].trim());
            console.log('datedate', lastDate);
        }

        fs.appendFile(logFileName, time.toISOString() + '\t' + task + '\n', function (err) {
            if (err) throw err;

            console.log("Took " + formatTimeDiff(time - lastDate));
        });
    })


}

module.exports = function (task, options) {

    //console.log(task, options);



    if (options.report) {
        report();
    } else {
        log(task, options);
    }
};
