#! /usr/bin/env node

var
  main = require('./main'),
  program = require('commander');

program
  .usage('[options] [task]')
  .option('-r, --report', 'print an hours report')
  .option('-t, --time <items>', 'backdates by time specified (i.e. 1h 5m)')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
  return;
}

main(program.args.join(" "), {
  report: program.report,
  time: program.time
});
