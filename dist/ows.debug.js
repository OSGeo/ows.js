var Ows4js = {};

Ows4js.version = '0.0.1';

Ows4js.Ows = {};
Ows4js.Fes = {};

Ows4js.NOTIE = true; // here's hoping

Ows4js.Proxy = '/cgi-bin/proxy.cgi?url=';
Ows4js.Util = {};

if (window.ActiveXObject) {
    Ows4js.NOTIE = false;
}

Ows4js.Namespaces = {
    'csw': 'http://www.opengis.net/cat/csw/2.0.2',
    'ogc': 'http://www.opengis.net/ogc',
    'ows': 'http://www.opengis.net/ows',
    'xlink': 'http://www.w3.org/1999/xlink'
};

Ows4js.IESelectionNamespaces = function() {
    var namespaces = [];
    for(var key in Ows4js.Namespaces) {
        namespaces.push(key + ':\'' + Ows4js.Namespaces[key] + '\'');
    }
    return namespaces.join(' ');
};

Ows4js.nsResolver = function(prefix) {
    return Ows4js.Namespaces[prefix] || null;
};

Ows4js.getXPathNode = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(xpath, doc, Ows4js.nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
};

Ows4js.getXPathNodeList = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var iter = evaluator.evaluate(xpath, doc, Ows4js.nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    return iter;
};

Ows4js.getXPathValue = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(xpath, doc, Ows4js.nsResolver,
        XPathResult.STRING_TYPE, null);
    return result.stringValue;
};

Ows4js.getXPathValueList = function(doc, xpath) {
    var list = [];
    var evaluator = new XPathEvaluator();
    var iter = evaluator.evaluate(xpath, doc, Ows4js.nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var node = iter.iterateNext();
    while (node) {
        list.push(node.value);
        node = iter.iterateNext();
    }
    return list;
};

Ows4js.getXPathNodeAttributeValue = function(doc, xpath){
    return doc.getAttributeNode(xpath).value;
};

Ows4js.Ows.ServiceIdentification = function(node) {
    this.title = Ows4js.getXPathValue(node, 'ows:Title');
    this.abstract = Ows4js.getXPathValue(node, 'ows:Abstract');
    this.keywords = Ows4js.getXPathValueList(node, 'ows:Keywords/ows:Keyword');
    this.type = Ows4js.getXPathValue(node, 'ows:ServiceType');
    this.version = Ows4js.getXPathValue(node, 'ows:ServiceTypeVersion');
    this.fees = Ows4js.getXPathValue(node, 'ows:Fees');
    this.accessconstraints = Ows4js.getXPathValue(node,
        'ows:AccessConstraints');
};

Ows4js.Ows.ServiceProvider = function(node) {
    this.name = Ows4js.getXPathValue(node, 'ows:ProviderName');
    this.url = Ows4js.getXPathValue(node, 'ows:ProviderSite/@xlink:href');

    var contact = Ows4js.getXPathNode(node, 'ows:ServiceContact');

    this.contact = {};
    this.contact.name = Ows4js.getXPathValue(contact, 'ows:IndividualName');
    this.contact.position = Ows4js.getXPathValue(contact, 'ows:PositionName');
    this.contact.role = Ows4js.getXPathValue(contact, '/ows:Role');

    var info = Ows4js.getXPathNode(contact, 'ows:ContactInfo');

    this.contact.phone = Ows4js.getXPathValue(info, 'ows:Phone/ows:Voice');
    this.contact.fax = Ows4js.getXPathValue(info, 'ows:Phone/ows:Facsimile');

    this.contact.address = {};
    var address = Ows4js.getXPathNode(info, 'ows:Address');

    this.contact.address.delivery = Ows4js.getXPathValue(address,
        'ows:DeliveryPoint');
    this.contact.address.city = Ows4js.getXPathValue(address,
        'ows:City');
    this.contact.address.adminarea = Ows4js.getXPathValue(address,
        'ows:AdministrativeArea');
    this.contact.address.postalcode = Ows4js.getXPathValue(address,
        'ows:PostalCode');
    this.contact.address.country = Ows4js.getXPathValue(address,
        'ows:Country');
    this.contact.address.email = Ows4js.getXPathValue(address,
        'ows:ElectronicMailAddress');

    this.contact.url = Ows4js.getXPathValue(info,
        'ows:OnlineResource/@xlink:href');
    this.contact.hours = Ows4js.getXPathValue(info, 'ows:HoursOfService');
    this.contact.instructions = Ows4js.getXPathValue(info,
        'ows:ContactInstructions');
};

Ows4js.Ows.OperationsMetadata = function(node) {
    var iter = null;
    var iter2 = null;
    var member = null;
    var member2 = null;
    var operation = null;
    var param = null;
    this.operations = [];
    this.parameters = [];
    this.constraints = [];

    iter = Ows4js.getXPathNodeList(node, 'ows:Operation');
    member = iter.iterateNext();
    while (member) {
        operation = {};
        operation.name = Ows4js.getXPathValue(member, '@name');
        operation.dcp = {'http': {}};
        operation.dcp.http.get = Ows4js.getXPathValue(member,
            'ows:DCP/ows:HTTP/ows:Get/@xlink:href');
        operation.dcp.http.post = Ows4js.getXPathValue(member,
            'ows:DCP/ows:HTTP/ows:Post/@xlink:href');

        operation.parameters = [];

        iter2 = Ows4js.getXPathNodeList(member, 'ows:Parameter');
        member2 = iter2.iterateNext();
        while (member2) {
            param = {};
            param.name = Ows4js.getXPathValue(member2, '@name');
            param.values = Ows4js.getXPathValueList(member2, 'ows:Value');
            operation.parameters.push(param);
            member2 = iter2.iterateNext();
        }

        operation.constraints = [];

        iter2 = Ows4js.getXPathNodeList(member, 'ows:Constraint');
        member2 = iter2.iterateNext();
        while (member2) {
            param = {};
            param.name = Ows4js.getXPathValue(member2, '@name');
            param.values = Ows4js.getXPathValueList(member2, 'ows:Value');
            operation.parameters.push(param);
            member2 = iter2.iterateNext();
        }
        this.operations.push(operation);
        member = iter.iterateNext();
    }

    iter = Ows4js.getXPathNodeList(node, 'ows:Parameter');
    member = iter.iterateNext();
    while (member) {
        param = {};
        param.name = Ows4js.getXPathValue(member, '@name');
        param.values = Ows4js.getXPathValueList(member, 'ows:Value');
        this.parameters.push(param);
        member = iter.iterateNext();
    }
    iter = Ows4js.getXPathNodeList(node, 'ows:Constraint');
    member = iter.iterateNext();
    while (member) {
        param = {};
        param.name = Ows4js.getXPathValue(member, '@name');
        param.values = Ows4js.getXPathValueList(member, 'ows:Value');
        this.constraints.push(param);
        member = iter.iterateNext();
    }

};

Ows4js.Fes.FilterCapabilities = function(node) {
    this.spatials = {};
    this.scalars = {};
    this.ids = {};

    this.spatials.geometries = Ows4js.getXPathValueList(node,
        'ogc:Spatial_Capabilities/ogc:GeometryOperands/ogc:GeometryOperand');
    this.spatials.operators = Ows4js.getXPathValueList(node,
        '//ogc:SpatialOperators/ogc:SpatialOperator/@name');

    this.scalars.comparisons = Ows4js.getXPathValueList(node,
        '//ogc:ComparisonOperators/ogc:ComparisonOperator');

    this.scalars.functions = Ows4js.getXPathValueList(node,
        '//ogc:FunctionNames/ogc:FunctionName');
};

/**
 * Util functions
 * */

Ows4js.loadXMLDoc = function(url) {
    var httpRequest;
    try {  // no proxy
        console.debug('no proxy');
        httpRequest = this.Util.httpGet(url);
        console.debug('found no proxy');
        if (httpRequest.status !== 200) {
            throw 'HTTP status code ' + httpRequest.status;
        }
        return httpRequest.responseXML;
    } catch (err) {  // with proxy
        try {
            console.warn(err);
            console.debug('with proxy');
            httpRequest = this.Util.httpGet(Ows4js.Proxy + url);
            console.debug('found with proxy');
            if (httpRequest.status !== 200) {
                throw 'HTTP status code ' + httpRequest.status;
            }
            return httpRequest.responseXML;
        } catch (err2) {
            console.error(err2);
            throw 'Unable to load XML from URL';
        }
    }
};

Ows4js.loadXMLString = function(txt) {
    var parser = null;
    var xmlDoc = null;

    if (Ows4js.NOTIE) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(txt, 'application/xml');
    } else {
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = false;
        xmlDoc.loadXML(txt);
    }
    return xmlDoc;
};

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

Ows4js.Util.httpPost = function(url, lang, request, async) {
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
 * Jsonix CSW unmarshaller
 *
 * */

Ows4js.Csw ={};

Ows4js.Csw = function(url, config) {
    this.version = '2.0.2';

    /**
     * Jsonix Configuration
     * */

    if (config == null)
        throw 'Missing Configuration! It is a must to CSW to know the profile';

    Ows4js.Csw.jsonnixContext = new Jsonix.Context(config[0], config[1]);

    // init by doing a GetCapabilities and parsing metadata
    this.url = url;
    console.log(this.url);
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
    // TODO change the httpRequest sync to async.
    // TODO CallBack or a Promise ?
    var me = this;
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML).then(function(responseXML){
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
    // TODO change the httpRequest sync to async.
    // TODO CallBack or a Promise ?
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML).then(function(responseXML){
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
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML).then(function(responseXML){
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
    return Ows4js.Util.httpPost(this.url, "application/xml", myXML).then(function(responseXML){
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
