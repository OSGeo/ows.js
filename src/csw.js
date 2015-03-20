/**
 * Jsonix CSW unmarshaller
 *
 * */

Ows4js.Csw ={};

Ows4js.Csw = function(url) {
    // init by doing a GetCapabilities and parsing metadata
    this.url = url;
    console.log(this.url);
    var getCapabilities = new Ows4js.Csw.GetCapabilities();
    // XML to Post.
    var myXML = Ows4js.Csw.marshalDocument(getCapabilities);
    // TODO change the httpRequest sync to async.
    // TODO CallBack or a Promise ?
    var httpRequest = Ows4js.Util.httpPost(this.url, "application/xml", myXML);
    var capabilities = Ows4js.Csw.unmarshalDocument(httpRequest.responseXML);

    this.serviceIdentification = capabilities['csw:Capabilities'].serviceIdentification;
    this.serviceProvider = capabilities['csw:Capabilities'].serviceProvider;
    this.operationsMetadata = capabilities['csw:Capabilities'].operationsMetadata;
    this.filterCapabilities = capabilities['csw:Capabilities'].filterCapabilities;
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
 * Operation name: GetRecords
 *
 * */

Ows4js.Csw.prototype.GetRecords = function(startPosition, maxRecords, filter) {
    // Create Query
    var query = new Ows4js.Csw.Query('full', new Ows4js.Csw.Constraint(filter));
    // Create de GetRecords Action.
    var recordAction = new Ows4js.Csw.GetRecords(startPosition, maxRecords, query);

    //console.log(recordAction);
    //console.log(JSON.stringify(recordAction));

    // XML to Post.
    var myXML = Ows4js.Csw.marshalDocument(recordAction);
    //console.log(myXML);
    // Post XML
    // TODO change the httpRequest sync to async.
    // TODO CallBack or a Promise ?
    var httpRequest = Ows4js.Util.httpPost(this.url, "application/xml", myXML);
    return  Ows4js.Csw.unmarshalDocument(httpRequest.responseXML);
};

// TODO check the dependencies. Maybe the dependencies must passed through the constructor?
Ows4js.Csw.jsonnixContext = new Jsonix.Context(
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
    }
);

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
    var httpRequest = Ows4js.Util.httpPost(this.url, "application/xml", myXML);
    //console.log(httpRequest.responseXML);
    return Ows4js.Csw.unmarshalDocument(httpRequest.responseXML);
};

Ows4js.Csw.prototype.getOperationByName = function(name) {
    for(var i = 0; i < this.operationsmetadata.operations.length; i++) {
        var opname = this.operationsmetadata.operations[i].name.toLowerCase();
        if (name.toLowerCase() === opname) {
            return this.operationsmetadata.operations[i];
        }
    }
    return false;
};

/**
 * Operation name: GetDomain
 * */

Ows4js.Csw.prototype.GetDomain = function(propertyName){
    var getdomainAction = new Ows4js.Csw.GetDomain(propertyName);
    var myXML = Ows4js.Csw.marshalDocument(getdomainAction);
    //console.log(myXML);
    var httpRequest = Ows4js.Util.httpPost(this.url, "application/xml", myXML);
    //console.log(httpRequest.responseXML);
    return Ows4js.Csw.unmarshalDocument(httpRequest.responseXML);
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
 * */

Ows4js.Csw.GetRecords = function(startPosition, maxRecords, query){
    this.name = {
        key: "{http://www.opengis.net/cat/csw/2.0.2}GetRecords",
        localPart: "GetRecords",
        namespaceURI: "http://www.opengis.net/cat/csw/2.0.2",
        prefix: "csw",
        string: "{http://www.opengis.net/cat/csw/2.0.2}csw:GetRecords"
    };
    this.value = {
        TYPE_NAME: "CSW_2_0_2.GetRecordsType",
        startPosition: startPosition,
        maxRecords: maxRecords,
        resultType: "results",
        service: "CSW",
        version: "2.0.2",
        abstractQuery: query
    };
};

/**
 * GetRecordById Request Template
 * */

Ows4js.Csw.GetRecordById = function(ids){
    this.name = {
        key: "{http://www.opengis.net/cat/csw/2.0.2}GetRecordById",
        localPart: "GetRecordById",
        namespaceURI: "http://www.opengis.net/cat/csw/2.0.2",
        prefix: "csw",
        string: "{http://www.opengis.net/cat/csw/2.0.2}csw:GetRecordById"
    };

    this.value = {
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
 * */

Ows4js.Csw.Query = function(elementSetName, constraint){
    this.name = {
        key: "{http://www.opengis.net/cat/csw/2.0.2}Query",
        localPart: "Query",
        namespaceURI: "http://www.opengis.net/cat/csw/2.0.2",
        prefix: "csw",
        string: "{http://www.opengis.net/cat/csw/2.0.2}csw:Query"
    };
    this.value = {
        TYPE_NAME: "CSW_2_0_2.QueryType",
        //constraint : {},
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
        this.value.constraint = constraint;
    }
};

/**
 * GetDomain Request Template
 * */

Ows4js.Csw.GetDomain = function (propertyName){
    this.name = {
        key: "{http://www.opengis.net/cat/csw/2.0.2}GetDomain",
        localPart: "GetDomain",
        namespaceURI: "http://www.opengis.net/cat/csw/2.0.2",
        prefix: "csw",
        string: "{http://www.opengis.net/cat/csw/2.0.2}csw:GetDomain"
    };
    this.value = {
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
 * The GetCabilities should be on the Ows.js ?
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