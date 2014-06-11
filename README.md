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
timelog replied to emails -t 1h
```

`**` indicates that it shouldn't count towards your work hours.

`cat-project:` indicates its part of the _cat-project_ category and will be bunched together in the report.

`-t 1h` will backdate the activity by 1 hour.

Options
----

```
Usage: index [options] <domain>

Options:

  -h, --help          output usage information
  -r, --report        print an hours report
  -t, --time <time>   backdates by time specified (i.e. 1h 5m)
```
