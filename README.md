timelog
=========

Node.js command line tool to quickly keep track of your time

Install
----

```bash
npm install -g timelog
```

Or if you are developing
```bash
git clone git@github.com:garrows/timelog.git
npm install -g ./timelog
```

> With [node](http://nodejs.org) installed.

Usage
-----

```bash
timelog arrived
timelog checked work emails
timelog cat-project: fixed 404 catbug
timelog lunch **
timelog cat-project: added concat feature
```

`**` indicates that it shouldn't count towards your work hours.

`cat-project:` indicates its part of the _cat-project_ category and will be bunched together in the report.

Options
----

```
Usage: index [options] <domain>

Options:

  -h, --help          output usage information
  -r, --report         Do not log to a file
```
