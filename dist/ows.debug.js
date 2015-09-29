var Ows4js = {};

Ows4js.version = '0.1.2';

Ows4js.Ows = {};
Ows4js.Fes = {};

Ows4js.Proxy = '/cgi-bin/proxy.cgi?url=';
Ows4js.Util = {};

/**
 * Util functions
 * */

Ows4js.Util.httpGet = function(url) {
    var httpRequest;
    try {
        try {
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
            httpRequest = new XMLHttpRequest();
        }
        httpRequest.open('GET', url, false);
        httpRequest.send(null);
        return httpRequest;
    } catch (e) {
        throw e;
    }
};

Ows4js.Util.httpPost = function(url, lang, request, credentials) {
    return new Promise(function(fulfill, reject){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange=function() {
            if (httpRequest.readyState==4 && httpRequest.status==200) {
                console.log(request);
                fulfill(httpRequest.responseXML);
            }
        };
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Accept-Language',lang);
        if (credentials != undefined && credentials.user != undefined && credentials.pass != undefined){
            httpRequest.setRequestHeader("Authorization", "Basic " + btoa(credentials.user + ":" + credentials.pass));
        }
        httpRequest.send(request);
    });
};

Ows4js.Util.buildUrl = function(url, params) {
    var kvps = [];

    for (var key in params) {
        if (params[key] !== null) {
            kvps.push(key+'='+params[key]);
        }
    }
    return url + '?' + kvps.join('&');
};
Ows4js.Filter= {};

Ows4js.Filter = function(){
    this['ogc:Filter'] = {
        TYPE_NAME : "Filter_1_1_0.FilterType"
    };

};

Ows4js.Filter.prototype.PropertyName = function (propertyName){
    // Temporary values
    this.tmp ={};
    // Temporary PropertyName
    this.tmp.PropertyName = propertyName;
    return this;
};

// Comparison Operators
Ows4js.Filter.prototype.isLike = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsLike' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsLikeType",
            escapeChar: "",
            singleChar: "_",
            wildCard: "%",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isNull = function(value){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isBetween = function(lowerValue, upperValue){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsBetween' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsBetweenType",
            expression :{
                'ogc:PropertyName': {
                    TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                    content: this.tmp.PropertyName
                }
            },
            lowerBoundary:{
                'ogc:Literal':{
                    TYPE_NAME: "Filter_1_1_0.LiteralType",
                    content :[lowerValue]
                }
            },
            upperBoundary:{
                'ogc:Literal':{
                    TYPE_NAME: "Filter_1_1_0.LiteralType",
                    content :[upperValue]
                }
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isEqualTo = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsEqualTo' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsEqualTo",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isLessThanOrEqualTo = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsLessThanOrEqualTo' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsLessThanOrEqualTo",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isGreaterThan = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsGreaterThan' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsGreaterThan",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isLessThan = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsLessThan' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsLessThan",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isGreaterThanOrEqualTo = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsGreaterThanOrEqualTo' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsGreaterThanOrEqualTo",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

Ows4js.Filter.prototype.isNotEqualTo = function(value){
    this['ogc:Filter'].comparisonOps = {
        'ogc:PropertyIsNotEqualTo' : {
            TYPE_NAME: "Filter_1_1_0.PropertyIsNotEqualTo",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: [value]
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: this.tmp.PropertyName
            }
        }
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
};

// Logical Operators

Ows4js.Filter.prototype.and = function(filter){
    if (typeof this['ogc:Filter'].logicOps === 'undefined') {
        //console.debug('The first And');
        this['ogc:Filter'].logicOps = {
            'ogc:And':{
                TYPE_NAME: "Filter_1_1_0.BinaryLogicOpType",
                //comparisonOpsOrSpatialOpsOrLogicOps: []
            }
        };
        /**
         *   TODO We need to check if the filter/operator is a
         *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
         *   (comparisonOps), ArithmeticOperators or is a composition of them
         *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
         *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
         */
        if (typeof this['ogc:Filter'].comparisonOps !== 'undefined') {
            // Only has one previous filter and it is a comparison operator.
            // Now is ops before was comparisonOpsOrSpatialOpsOrLogicOps
            this['ogc:Filter'].logicOps['ogc:And'].ops = [this['ogc:Filter'].comparisonOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this['ogc:Filter'].comparisonOps;
        } else if (typeof this['ogc:Filter'].spatialOps !== 'undefined'){
            // Only has one previous filter and it is a spatial operator.
            this['ogc:Filter'].logicOps['ogc:And'].ops = [this['ogc:Filter'].spatialOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this['ogc:Filter'].spatialOps;
        } else {
            throw 'Not Implemented yet, another operators';
        }
    } else {
        // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:Or'.
        this['ogc:Filter'].logicOps['ogc:And'].ops = this['ogc:Filter'].logicOps['ogc:And'].ops.concat(Ows4js.Filter.getPreviousOperator(filter));
    }
    return this;
};//*/

Ows4js.Filter.prototype.or = function(filter){
    if (typeof this['ogc:Filter'].logicOps === 'undefined') {
        //console.debug('The first Or');
        this['ogc:Filter'].logicOps = {
            'ogc:Or':{
                TYPE_NAME: "Filter_1_1_0.BinaryLogicOpType",
                //comparisonOpsOrSpatialOpsOrLogicOps: []
            }
        };
        /**
         *   TODO We need to check if the filter/operator is a
         *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
         *   (comparisonOps), ArithmeticOperators or is a composition of them
         *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
         *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
         */
        if (typeof this['ogc:Filter'].comparisonOps !== 'undefined') {
            // Only has one previous filter and it is a comparison operator.
            this['ogc:Filter'].logicOps['ogc:Or'].ops = [this['ogc:Filter'].comparisonOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this['ogc:Filter'].comparisonOps;
        } else if (typeof this['ogc:Filter'].spatialOps !== 'undefined'){
            // Only has one previous filter and it is a spatial operator.
            this['ogc:Filter'].logicOps['ogc:Or'].ops = [this['ogc:Filter'].spatialOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this['ogc:Filter'].spatialOps;
        } else {
            throw 'Not Implemented yet, another operators';
        }
    } else {
        // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:And'.
        this['ogc:Filter'].logicOps['ogc:Or'].ops = this['ogc:Filter'].logicOps['ogc:Or'].ops.concat(Ows4js.Filter.getPreviousOperator(filter));
    }
    return this;
};

Ows4js.Filter.prototype.not = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.getPreviousOperator = function(filter){
    var operator;
    if (typeof filter['ogc:Filter'].comparisonOps !== 'undefined') {
        // Only has one previous filter and it is a comparison operator.
        operator = filter['ogc:Filter'].comparisonOps;
    } else if (typeof filter['ogc:Filter'].spatialOps !== 'undefined'){
        // Only has one previous filter and it is a spatial operator.
        operator = filter['ogc:Filter'].spatialOps;
    } else if (typeof filter['ogc:Filter'].logicOps !== 'undefined') {
        operator = filter['ogc:Filter'].logicOps;
    } else {
        console.error(filter);
        throw 'Not Implemented yet, another operators';
    }
    return operator;
};

// Spatial Operators

/**
 * TODO
 * Beyond
 * Contains
 * Crosses
 * Disjoint
 * DWithin
 * Equals
 * Intersects
 * Overlaps
 * Touches
 * Within
 * */

Ows4js.Filter.prototype.BBOX = function(llat, llon, ulat, ulon, srsName) {
    this['ogc:Filter'].spatialOps = {
        'ogc:BBOX' : {
            TYPE_NAME: "Filter_1_1_0.BBOXType",
            envelope :{
                'gml:Envelope' : {
                    TYPE_NAME: "GML_3_1_1.EnvelopeType",
                    lowerCorner: {
                        TYPE_NAME: "GML_3_1_1.DirectPositionType",
                        value : [llat, llon]
                    },
                    upperCorner : {
                        TYPE_NAME: "GML_3_1_1.DirectPositionType",
                        value : [ulat, ulon]
                    },
                    srsName: srsName
                }
            },
            propertyName :{
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: "ows:BoundingBox"
            }
        }
    };
    return this;
};

// TODO check the dependencies. Maybe the dependencies must passed through the constructor?
Ows4js.Filter.JsonixContext = new Jsonix.Context(
    [
        OWS_1_0_0,
        DC_1_1,
        DCT,
        XLink_1_0,
        SMIL_2_0,
        SMIL_2_0_Language,
        GML_3_1_1,
        Filter_1_1_0,
        CSW_2_0_2
    ],
    {
        namespacePrefixes: {
            'http://www.opengis.net/cat/csw/2.0.2': 'csw',
            "http://www.opengis.net/ogc": 'ogc',
            "http://www.opengis.net/gml": "gml"
        },
        mappingStyle : 'simplified'
    });

Ows4js.Filter.prototype.getXML = function(){
    var doc;
    var marshaller= Ows4js.Filter.JsonixContext.createMarshaller();
    doc = marshaller.marshalDocument(this);
    return doc;
};

/**
 * This function return a Basic Object Filter, without the functions
 * to construct a filter. Only to use with Jsonix purposes.
 * */

Ows4js.Filter.prototype.getBasicFilterFromXML = function(xml){
    var unmarshaller = Ows4js.Filter.JsonixContext.createUnmarshaller();
    return unmarshaller.unmarshalDocument(xml);
};
/**
 * Jsonix CSW unmarshaller
 *
 * */

Ows4js.Csw ={};

Ows4js.Csw = function(url, config) {
    this.version = '2.0.2';
    /**
     * Jsonix Configuration
     * */
    if (config == null){
        throw 'Missing Configuration! It is a must to CSW to know the profile';
    } else if (config[2] != undefined){
        this.credentials = config[2];
    }
    Ows4js.Csw.jsonnixContext = new Jsonix.Context(config[0], config[1]);
    // init by doing a GetCapabilities and parsing metadata
    this.url = url;
};

/**
 *
 * Operations List:
 *
 * GetCapabilities
 * Transaction
 * GetRepositoryItem
 * DescribeRecord
 * GetDomain
 * GetRecordById
 * GetRecords
 * Harvest
 *
 * */

/**
 * Operation name: GetCapabilities
 *
 */

Ows4js.Csw.prototype.GetCapabilities = function(){
    var getCapabilities = new Ows4js.Csw.GetCapabilities();
    // XML to Post.
    var myXML = Ows4js.Csw.marshalDocument(getCapabilities);
    var me = this;
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        var capabilities;
        capabilities = Ows4js.Csw.unmarshalDocument(responseXML);
        console.log(capabilities);
        me.serviceIdentification = capabilities['csw:Capabilities'].serviceIdentification;
        me.serviceProvider = capabilities['csw:Capabilities'].serviceProvider;
        me.operationsMetadata = capabilities['csw:Capabilities'].operationsMetadata;
        me.filterCapabilities = capabilities['csw:Capabilities'].filterCapabilities;
        return me;
    });
};


/**
 * Operation name: GetRecords
 *
 * */

Ows4js.Csw.prototype.GetRecords = function(startPosition, maxRecords, filter, outputSchema) {

    var query;
    if (filter === undefined || filter === null) {
        query = new Ows4js.Csw.Query('full');
    } else {
        // Create Query
        query = new Ows4js.Csw.Query('full', new Ows4js.Csw.Constraint(filter));
    }
    // Create de GetRecords Action.
    var recordAction = new Ows4js.Csw.GetRecords(startPosition, maxRecords, query, outputSchema);
    // XML to Post.
    var myXML = Ows4js.Csw.marshalDocument(recordAction);
    console.log(recordAction);
    console.log(myXML);
    // Post XML
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        console.log(responseXML);
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });

};

Ows4js.Csw.marshalDocument = function(object){
    return Ows4js.Csw.jsonnixContext.createMarshaller().marshalDocument(object);
};

Ows4js.Csw.unmarshalDocument = function(xml){
    return Ows4js.Csw.jsonnixContext.createUnmarshaller().unmarshalDocument(xml);
};

// To simplify de API.
Ows4js.Csw.xmlToObject = function(xml){
    return Ows4js.Csw.unmarshalDocument(xml);
};

Ows4js.Csw.objectToXML = function(object){
    return Ows4js.Csw.marshalDocument(object);
};

Ows4js.Csw.unmarshalString = function(string){
    return Ows4js.Csw.jsonnixContext.createUnmarshaller().unmarshalString(string);
};

/**
 * Operation name: GetRecordById
 **/

Ows4js.Csw.prototype.GetRecordById = function(id_list) {
    var byIdAction = new Ows4js.Csw.GetRecordById(id_list);
    //console.log(byIdAction);
    var myXML = Ows4js.Csw.marshalDocument(byIdAction);
    //console.log(myXML);
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });
};

Ows4js.Csw.prototype.getOperationByName = function(name) {
    return  this.operationsMetadata.operation.filter(function(element){
        return element.name === name;
    })[0];
};

/**
 * Operation name: GetDomain
 * */

Ows4js.Csw.prototype.GetDomain = function(propertyName){
    var getdomainAction = new Ows4js.Csw.GetDomain(propertyName);
    var myXML = Ows4js.Csw.marshalDocument(getdomainAction);
    //console.log(myXML);
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });
};

/**
 * Operation name: Insert
 */

Ows4js.Csw.prototype.insertRecords = function (records){
    var transactionAction = new Ows4js.Csw.Insert(records);
    var transaction = new Ows4js.Csw.Transaction(transactionAction);
    console.log(transaction);
    var myXML = Ows4js.Csw.marshalDocument(transaction);
    console.log(myXML);
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });
};

/**
 * Operation name: Update
 */

Ows4js.Csw.prototype.updateRecord = function(records){
    var transactionAction = new Ows4js.Csw.Update(records);
    var transaction = new Ows4js.Csw.Transaction(transactionAction);
    console.log(transaction);
    var myXML = Ows4js.Csw.marshalDocument(transaction);
    console.log(myXML);
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });
};

/**
 * Operation name: Delete
 */
Ows4js.Csw.prototype.deleteRecords = function(filter){
    var transactionAction = new Ows4js.Csw.Delete(filter);
    var transaction = new Ows4js.Csw.Transaction(transactionAction);
    var myXML = Ows4js.Csw.marshalDocument(transaction);
    console.log(myXML);
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML, this.credentials).then(function(responseXML){
        return Ows4js.Csw.unmarshalDocument(responseXML);
    });
};

/**
 * Templates for Requests
 * */

/**
 * Constraint Request Template
 * */

Ows4js.Csw.Constraint = function(filter){
    this.TYPE_NAME = "CSW_2_0_2.QueryConstraintType";
    this.version = "1.1.0";
    this.filter = filter;
};

/**
 * GetRecords Request Template
 *
 * This Objects already use the simple mapping style from jsonix
 * */

Ows4js.Csw.GetRecords = function(startPosition, maxRecords, query, outputSchema){
    this['csw:GetRecords'] = {
        TYPE_NAME: "CSW_2_0_2.GetRecordsType",
        abstractQuery: query,
        startPosition: startPosition,
        maxRecords: maxRecords,
        resultType: "results",
        service: "CSW",
        version: "2.0.2"
    };

    if (outputSchema){
        this['csw:GetRecords'].outputSchema = outputSchema;
    }

    console.log(this);
};

/**
 * GetRecordById Request Template
 *
 * This Objects already use the simple mapping style from jsonix
 * */

Ows4js.Csw.GetRecordById = function(ids){
    this['csw:GetRecordById'] ={
        TYPE_NAME: "CSW_2_0_2.GetRecordByIdType",
        elementSetName: {
            ObjectTYPE_NAME: "CSW_2_0_2.ElementSetNameType",
            value: "full"
        },
        id: ids,
        service :  "CSW",
        version : "2.0.2"
    };
};

/**
 * Query Request Template
 *
 * This Objects already use the simple mapping style from jsonix
 * */

Ows4js.Csw.Query = function(elementSetName, constraint){
    this['csw:Query'] = {
        TYPE_NAME: "CSW_2_0_2.QueryType",
        elementSetName : {
            TYPE_NAME: "CSW_2_0_2.ElementSetNameType",
            value: elementSetName
        },
        typeNames : [
            {
                key: "{http://www.opengis.net/cat/csw/2.0.2}Record",
                localPart: "Record",
                namespaceURI: "http://www.opengis.net/cat/csw/2.0.2",
                prefix: "csw",
                string: "{http://www.opengis.net/cat/csw/2.0.2}csw:Record"
            }
        ]
    };
    if (constraint){
        this['csw:Query'].constraint = constraint;
    }
};

/**
 * GetDomain Request Template
 *
 * This Objects already use the simple mapping style from jsonix
 * */

Ows4js.Csw.GetDomain = function (propertyName){
    this['csw:GetDomain'] ={
        TYPE_NAME: "CSW_2_0_2.GetDomainType",
        propertyName: propertyName,
        service: "CSW",
        version: "2.0.2"
    };
};

/**
 * GetCapabilities Request Template
 *
 * This Objects already use the simple mapping style from jsonix
 * The GetCapabilities should be on the Ows.js ?
 */
Ows4js.Csw.GetCapabilities = function () {
    this["csw:GetCapabilities"] = {
        "TYPE_NAME":"CSW_2_0_2.GetCapabilitiesType",
        "service":"CSW",
        "acceptVersions": {
            "TYPE_NAME":"OWS_1_0_0.AcceptVersionsType",
            "version":["2.0.2"]
        },
        "acceptFormats": {
            "TYPE_NAME": "OWS_1_0_0.AcceptFormatsType",
            "outputFormat":["application/xml"]
        }
    }
};

/**
 * Transaction Request Template
 */

Ows4js.Csw.Transaction = function(action){
  this['csw:Transaction'] = {
      'TYPE_NAME': "CSW_2_0_2.TransactionType",
      insertOrUpdateOrDelete: [action],
      service: "CSW",
      version: "2.0.2"
  }
};

/**
 * Insert template
 */

Ows4js.Csw.Insert = function(records){
    this.TYPE_NAME =  "CSW_2_0_2.InsertType";
    this.any = records;
};

/**
 * Update Template
 */

Ows4js.Csw.Update = function(records) {
    this.TYPE_NAME =  "CSW_2_0_2.UpdateType";
    this.any = records;
};

/**
 * Delete Template
 */

Ows4js.Csw.Delete = function(filter){
    this.TYPE_NAME = "CSW_2_0_2.DeleteType";
    this.constraint = {
        TYPE_NAME: "CSW_2_0_2.QueryConstraintType",
        filter : filter,
        version: "1.1.0"
    };
};