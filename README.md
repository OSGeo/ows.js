#ows.js

[![Build Status](https://travis-ci.org/OSGeo/ows.js.png?branch=master)](https://travis-ci.org/OSGeo/ows.js)

OGC Web Services Library for JavaScript.

#### Getting started

###### clone de repository and install dependecies

```bash
git clone https://github.com/juanmav/ows.js.git
cd ows.js/
npm install
```

###### run the example project

```bash
grunt serve
```

###### Go to your browser and open the dev console

- [http://127.0.0.1:9000/examples/](http://127.0.0.1:9000/examples/)
- Press F12 (Chrome & Firerfox)

### Implemented

- Basic Ows operations (ex: GetCapabilities)
- CSW
 - GetRecords
 - GetRecordById
 - GetDomain
- OGC Filters
 - Operators:
  - AND
  - BBOX
  - isLike

### Next TODOS

- GetCapabilities Refactor
- OR Operators
- PropertyIsBetween
- PropertyIs"*" Operators
- Improve Unit Test (Help is extremely Welcome here :D)

##### How to build ows.min.js

```bash
grunt dist
```
