/**
 * Jsonix CSW unmarshaller
 *
 * */

Ows4js.Csw ={};

Ows4js.Csw = function(url) {
    // init by doing a GetCapabilities and parsing metadata
    var node = null;
    this.url = url;
    this.version = '2.0.2';

    var params = {
        'service': 'CSW',
        'version': this.version,
        'request': 'GetCapabilities'
    };

    console.log(this.url);
    try {
        try {
            console.debug('Fetching url with params');
            this.xml = Ows4js.loadXMLDoc(
                Ows4js.Util.buildUrl(this.url, params));
        } catch (err2) {
            console.debug('Fetching url with no params (static doc)');
            this.xml = Ows4js.loadXMLDoc(this.url, params);
        }
    } catch(err) {  // string
        console.error(err);
        this.xml = Ows4js.loadXMLString(this.url, params);
    }
    // TODO: error checking, etc.

    // get main sections and parse them (TODO)
    console.debug('Procesing ows:ServiceIdentificaiton');
    node = Ows4js.getXPathNode(this.xml, '//ows:ServiceIdentification');
    this.identification = new Ows4js.Ows.ServiceIdentification(node);

    console.debug('Procesing ows:ServiceProvider');
    node = Ows4js.getXPathNode(this.xml, '//ows:ServiceProvider');
    this.provider = new Ows4js.Ows.ServiceProvider(node);

    console.debug('Procesing ows:OpeartionsMetadata');
    node = Ows4js.getXPathNode(this.xml, '//ows:OperationsMetadata');
    this.operationsmetadata = new Ows4js.Ows.OperationsMetadata(node);

    console.debug('Procesing ogc:Filter_Capabilities');
    node = Ows4js.getXPathNode(this.xml, '//ogc:Filter_Capabilities');
    this.filtercapabilities = new Ows4js.Fes.FilterCapabilities(node);
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
 *
 * TODO refactor to return Javascript Object.
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
* Constraint Request
* */

Ows4js.Csw.Constraint = function(filter){
    this.TYPE_NAME = "CSW_2_0_2.QueryConstraintType";
    this.version = "1.1.0";
    this.filter = filter;
};

/**
 * GetRecords Request
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
 * GetRecordById
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
 * Query Request
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