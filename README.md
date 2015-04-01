#ows.js

[![Build Status](https://travis-ci.org/juanmav/ows.js.png?branch=master)](https://travis-ci.org/juanmav/ows.js)

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
  - OR
  - BBOX
  - isLike

### Next TODOS

- PropertyIsBetween
- PropertyIs"*" Operators
- Improve Unit-Tests (Help is extremely Welcome here :D)
- DescribeRecord

### How to install ows.js in your project.

```bash
 bower install ows.js --save
```

> no tags at the moment.

you also need to add to your index.html

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

### How to build ows.min.js

```bash
grunt dist
```

