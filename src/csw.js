var Ows = {};

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
        list.push(node.textContent);
        node = iter.iterateNext();
    }	
    return list;
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

Ows4js.Csw.prototype.GetRecords = function() {
    return 'GetRecords called';
};

Ows4js.Csw.prototype.GetRecordById = function(id_list, esn,
    outputformat, outputschema) {
    var params = {
        'service': 'CSW',
        'version': this.version,
        'request': 'GetRecordById',
        'outputformat': outputformat || null,
        'outputschema': outputschema || null,
        'elementsetname': esn || null,
        'id': id_list.join(',')
    };

    var url = this.getOperationByName('GetRecordById').dcp.http.get;
    this.xml = Ows4js.loadXMLDoc(Ows4js.Util.buildUrl(url, params));
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

// util functions

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
        xmlDoc = parser.parseFromString(txt, 'text/xml');
    }
    else {
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

Ows4js.Util.httpPost = function(url, lang, request) {
    var httpRequest;
    try {
        try {
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
            httpRequest = new XMLHttpRequest();
        }
        httpRequest.open('POST', url, false);
        httpRequest.setRequestHeader('Accept-Language',lang);
        httpRequest.send(request);
        return httpRequest;
    } catch (e) {
        throw(e);
    }
};

Ows4js.Util.buildUrl = function(url, params) {
    var kvps = [];

    for (var key in params) {
        if (params[key] !== null) {
            kvps.push(key+'='+params[key]); 
        }
    }
    return url + escape('?' + kvps.join('&'));
};
