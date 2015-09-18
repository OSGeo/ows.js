#ows.js

[![Build Status](https://travis-ci.org/OSGeo/ows.js.png?branch=master)](https://travis-ci.org/OSGeo/ows.js)

OGC Web Services Library for JavaScript.

> This Library is based in the awesome work of [Jsonix](https://github.com/highsource/jsonix) & [ogc-schemas](https://github.com/highsource/ogc-schemas) libraries.

## Getting started

###Clone de repository and install dependencies

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
- Press F12 (Chrome & Firefox)


### Or how to install ows.js in your project.

```bash
 bower install ows.js --save
```

> no tags at the moment.

**you also need to add to your index.html**

```html
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/OWS_1_0_0.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/DC_1_1.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/DCT.js"></script>
<script type="text/javascript" src="../bower_components/w3c-schemas/lib/XLink_1_0.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/CSW_2_0_2.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/Filter_1_1_0.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/GML_3_1_1.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/SMIL_2_0_Language.js"></script>
<script type="text/javascript" src="../bower_components/ogc-schemas/lib/SMIL_2_0.js"></script>
```


### Implemented

- Basic Ows operations (ex: GetCapabilities)
- CSW
 - GetRecords
 - GetRecordById
 - GetDomain
 - GetCapabilities (Refactored)
- OGC Filters
 - Operators:
  - Logical Operators:
    - AND
    - OR
  - Spatial Operatos:
    - BBOX
  - Comparison
    - isLike
    - isBetween
    - isEqualTo
    - isLessThanOrEqualTo
    - isGreaterThan
    - isLessThan
    - isGreaterThanOrEqualTo
    - isNotEqualTo


### Next TODOS

- Clean Ows.js deprecated code.
- Implement NOT operator.
- PropertyIsNull
- Improve Unit-Tests (Help is extremely Welcome here :D)
- DescribeRecord

#### in the Future

- WPS
- WFS
- SLD
- etc...

### How to build ows.min.js

```bash
grunt dist
```
