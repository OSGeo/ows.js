# ows.js

[![Build Status](https://travis-ci.org/OSGeo/ows.js.png?branch=master)](https://travis-ci.org/OSGeo/ows.js)

OGC Web Services Library for JavaScript.

> This Library is based in the awesome work of [Jsonix](https://github.com/highsource/jsonix) & [ogc-schemas](https://github.com/highsource/ogc-schemas) libraries.

#### Implemented so far

- Basic Ows operations (ex: GetCapabilities)
- CSW
    - GetRecords
    - GetRecordById
    - GetDomain
    - GetCapabilities (Refactored)
    - Transactions:
        - Create
        - Update
        - Delete
  
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


#### Next TODOS

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

## Getting started

### How to install ows.js in your project.

It is recommended to use bower, because this project depends on Jsonix and Ogc-schemas libraries.

```bash
 bower install ows.js --save
```

### Using and configure CSW

The CSW standard strongly depends on catalogues profiles. So first you need to determine what profile you want to use and include its depencies:

#### Basic CSW

Include in you project:

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

Configure CSW:

```javascript
var cswConfig = [
            [
                OWS_1_0_0,
                DC_1_1,
                DCT,
                XLink_1_0,
                SMIL_2_0,
                SMIL_2_0_Language,
                GML_3_1_1,
                Filter_1_1_0,
                CSW_2_0_2,
                GML_3_1_1
            ],
            {
                namespacePrefixes: {
                    'http://www.opengis.net/cat/csw/2.0.2': 'csw',
                    "http://www.opengis.net/ogc": 'ogc',
                    "http://www.opengis.net/gml": "gml",
                    "http://purl.org/dc/elements/1.1/":"dc",
                    "http://purl.org/dc/terms/":"dct"
                },
                mappingStyle : 'simplified'
            }
        ];
```

#### ISO 19139 (implementation of 19115)

Include in you project:

```html
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/OWS_1_0_0.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/DC_1_1.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/DCT.js"></script>
<script type="text/javascript" src="../node_modules/w3c-schemas/lib/XLink_1_0.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/CSW_2_0_2.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/Filter_1_1_0.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/GML_3_1_1.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/SMIL_2_0_Language.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/SMIL_2_0.js"></script>
<!-- ISO Profile -->
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/GML_3_2_0.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GCO_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GMD_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GTS_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GSS_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GSR_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_GMX_20060504.js"></script>
<script type="text/javascript" src="../node_modules/ogc-schemas/lib/ISO19139_SRV_20060504.js"></script>
```

Configure CSW:

```javascript
var cswConfig = [
            [
                OWS_1_0_0,
                DC_1_1,
                DCT,
                XLink_1_0,
                SMIL_2_0,
                SMIL_2_0_Language,
                GML_3_1_1,
                Filter_1_1_0,
                CSW_2_0_2,
                GML_3_2_0,
                ISO19139_GSS_20060504,
                ISO19139_GSR_20060504,
                ISO19139_GTS_20060504,
                ISO19139_GMD_20060504,
                ISO19139_GCO_20060504,
                ISO19139_SRV_20060504
            ],
            {
                namespacePrefixes: {
                    "http://www.opengis.net/cat/csw/2.0.2": "csw",
                    "http://www.opengis.net/ogc": 'ogc',
                    "http://www.opengis.net/gml": "gml",
                    "http://purl.org/dc/elements/1.1/":"dc",
                    "http://purl.org/dc/terms/":"dct",
                    "http://www.isotc211.org/2005/gmd" : "gmd",
                    "http://www.isotc211.org/2005/gco" : "gco",
                },
                mappingStyle : 'simplified'
            }
        ];
```

#### Make a request

**Simple**

```javascript
var cswConfig = ..... ; //
var csw = new Ows4js.Csw('http://youcatalogueurl/', cswConfig);

csw.GetRecords(1,10).then(function(result){
    console.log(result);
});

```

**With a ogc-filter**

```javascript
var cswConfig = ..... ; //
var csw = new Ows4js.Csw('http://youcatalogueurl/', cswConfig);
 
var filter = new Ows4js.Filter().PropertyName('dc:title').isLike('%water%');
filter = filter.and(new Ows4js.Filter().PropertyName('dc:subject').isLike('%polution%'));
filter = filter.and(new Ows4js.Filter().BBOX(-80, 150, 80, -150, 'urn:x-ogc:def:crs:EPSG:6.11:4326'));


csw.GetRecords(1,10, filter).then(function(result){
    console.log(result);
});
```
 
### Developer Zone

#### Clone de repository and install dependencies

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

#### How to build ows.min.js

```bash
grunt dist
```
