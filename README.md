#ows.js

[![Build Status](https://travis-ci.org/OSGeo/ows.js.png?branch=master)](https://travis-ci.org/OSGeo/ows.js)

OGC Web Services Library for JavaScript.

## Getting started

**clone de repository and install dependecies**

```bash
git clone https://github.com/juanmav/ows.js.git
cd ows.js/
npm install
```

**run the example project**
```bash
grunt serve
```

**Go to the browser and open the dev console**

- [http://127.0.0.1:9000/examples/](http://127.0.0.1:9000/examples/)
- Press F12 (Chrome & Firerfox)

### Implemented

- Basic Ows operations (ex: GetCapabilities)
- CSW
 - GetRecords
 - GetRecordById
 - GetDomain
 - GetCapabilities (Refactored)
- OGC Filters
 - Operators:
  - AND
  - BBOX
  - isLike

### Next TODOS

- OR Operator
- PropertyIsBetween
- PropertyIs"*" Operators
- Improve Unit-Tests (Help is extremely Welcome here :D)
- DescribeRecord

### How to install ows.js in your project.

```bash
 bower install ows.js --save
```

> no tags at the moment.

### How to build ows.min.js

```bash
grunt dist
```

