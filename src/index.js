#! /usr/bin/env node

var
  main = require('./main'),
  program = require('commander');

program
  .usage('[options] <domain>')
  .option('-L, --nolog', 'Do not log to a file')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
  return;
}

main(program.args.join(" "), {
  nolog: program.nolog,
  unavailable: program.unavailable === true,
  verbose: program.verbose === true
});
