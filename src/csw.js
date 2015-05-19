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
