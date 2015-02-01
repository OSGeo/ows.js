var Ows = {};

Ows.version = '0.0.1';

Ows.Ows = {};
Ows.Fes = {};

Ows.NOTIE = true; // here's hoping

Ows.Proxy = '/cgi-bin/proxy.cgi?url=';
Ows.Util = {};

if (window.ActiveXObject) {
    Ows.NOTIE = false;
}

Ows.Namespaces = {
    'csw': 'http://www.opengis.net/cat/csw/2.0.2',
    'ogc': 'http://www.opengis.net/ogc',
    'ows': 'http://www.opengis.net/ows',
    'xlink': 'http://www.w3.org/1999/xlink'
};

Ows.IESelectionNamespaces = function() {
    var namespaces = [];
    for(var key in Ows.Namespaces) {
        namespaces.push(key + ':\'' + Ows.Namespaces[key] + '\'');
    }
    return namespaces.join(' ');
};

Ows.nsResolver = function(prefix) {
    return Ows.Namespaces[prefix] || null;
};

Ows.getXPathNode = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(xpath, doc, Ows.nsResolver,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
};

Ows.getXPathNodeList = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var iter = evaluator.evaluate(xpath, doc, Ows.nsResolver,
                                  XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    return iter;
};
Ows.getXPathValue = function(doc, xpath) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(xpath, doc, Ows.nsResolver,
                                    XPathResult.STRING_TYPE, null);
    return result.stringValue;
};

Ows.getXPathValueList = function(doc, xpath) {
    var list = [];
    var evaluator = new XPathEvaluator();
    var iter = evaluator.evaluate(xpath, doc, Ows.nsResolver,
                                  XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var node = iter.iterateNext();
    while (node) {
        list.push(node.textContent);
        node = iter.iterateNext();
    }	
    return list;
};

Ows.Ows.ServiceIdentification = function(node) {
    this.title = Ows.getXPathValue(node, 'ows:Title');
    this.abstract = Ows.getXPathValue(node, 'ows:Abstract');
    this.keywords = Ows.getXPathValueList(node, 'ows:Keywords/ows:Keyword');
    this.type = Ows.getXPathValue(node, 'ows:ServiceType');
    this.version = Ows.getXPathValue(node, 'ows:ServiceTypeVersion');
    this.fees = Ows.getXPathValue(node, 'ows:Fees');
    this.accessconstraints = Ows.getXPathValue(node,
        'ows:AccessConstraints');
};

Ows.Ows.ServiceProvider = function(node) {
    this.name = Ows.getXPathValue(node, 'ows:ProviderName');
    this.url = Ows.getXPathValue(node, 'ows:ProviderSite/@xlink:href');

    var contact = Ows.getXPathNode(node, 'ows:ServiceContact');

    this.contact = {};
    this.contact.name = Ows.getXPathValue(contact, 'ows:IndividualName');
    this.contact.position = Ows.getXPathValue(contact, 'ows:PositionName');
    this.contact.role = Ows.getXPathValue(contact, '/ows:Role');

    var info = Ows.getXPathNode(contact, 'ows:ContactInfo');

    this.contact.phone = Ows.getXPathValue(info, 'ows:Phone/ows:Voice');
    this.contact.fax = Ows.getXPathValue(info, 'ows:Phone/ows:Facsimile');

    this.contact.address = {};
    var address = Ows.getXPathNode(info, 'ows:Address');

    this.contact.address.delivery = Ows.getXPathValue(address,
        'ows:DeliveryPoint');
    this.contact.address.city = Ows.getXPathValue(address,
        'ows:City');
    this.contact.address.adminarea = Ows.getXPathValue(address,
        'ows:AdministrativeArea');
    this.contact.address.postalcode = Ows.getXPathValue(address,
        'ows:PostalCode');
    this.contact.address.country = Ows.getXPathValue(address,
        'ows:Country');
    this.contact.address.email = Ows.getXPathValue(address,
        'ows:ElectronicMailAddress');

    this.contact.url = Ows.getXPathValue(info,
        'ows:OnlineResource/@xlink:href');
    this.contact.hours = Ows.getXPathValue(info, 'ows:HoursOfService');
    this.contact.instructions = Ows.getXPathValue(info,
        'ows:ContactInstructions');
};

Ows.Ows.OperationsMetadata = function(node) {
    var iter = null;
    var iter2 = null;
    var member = null;
    var member2 = null;
    var operation = null; 
    var param = null;
    this.operations = [];
    this.parameters = [];
    this.constraints = [];

    iter = Ows.getXPathNodeList(node, 'ows:Operation');
    member = iter.iterateNext();
    while (member) {
        operation = {};
        operation.name = Ows.getXPathValue(member, '@name');
        operation.dcp = {'http': {}};
        operation.dcp.http.get = Ows.getXPathValue(member,
            'ows:DCP/ows:HTTP/ows:Get/@xlink:href');
        operation.dcp.http.post = Ows.getXPathValue(member,
            'ows:DCP/ows:HTTP/ows:Post/@xlink:href');

        operation.parameters = [];

        iter2 = Ows.getXPathNodeList(member, 'ows:Parameter');
        member2 = iter2.iterateNext();
        while (member2) {
            param = {};
            param.name = Ows.getXPathValue(member2, '@name');
            param.values = Ows.getXPathValueList(member2, 'ows:Value');
            operation.parameters.push(param);
            member2 = iter2.iterateNext();
        }

        operation.constraints = [];

        iter2 = Ows.getXPathNodeList(member, 'ows:Constraint');
        member2 = iter2.iterateNext();
        while (member2) {
            param = {};
            param.name = Ows.getXPathValue(member2, '@name');
            param.values = Ows.getXPathValueList(member2, 'ows:Value');
            operation.parameters.push(param);
            member2 = iter2.iterateNext();
        }
        this.operations.push(operation);
        member = iter.iterateNext();
    }

    iter = Ows.getXPathNodeList(node, 'ows:Parameter');
    member = iter.iterateNext();
    while (member) {
        param = {};
        param.name = Ows.getXPathValue(member, '@name');
        param.values = Ows.getXPathValueList(member, 'ows:Value');
        this.parameters.push(param);
        member = iter.iterateNext();
    }
    iter = Ows.getXPathNodeList(node, 'ows:Constraint');
    member = iter.iterateNext();
    while (member) {
        param = {};
        param.name = Ows.getXPathValue(member, '@name');
        param.values = Ows.getXPathValueList(member, 'ows:Value');
        this.constraints.push(param);
        member = iter.iterateNext();
    }

};

Ows.Fes.FilterCapabilities = function(node) {
    this.spatials = {};
    this.scalars = {};
    this.ids = {};

    this.spatials.geometries = Ows.getXPathValueList(node,
        'ogc:Spatial_Capabilities/ogc:GeometryOperands/ogc:GeometryOperand');
    this.spatials.operators = Ows.getXPathValueList(node,
        '//ogc:SpatialOperators/ogc:SpatialOperator/@name');

    this.scalars.comparisons = Ows.getXPathValueList(node,
        '//ogc:ComparisonOperators/ogc:ComparisonOperator');

    this.scalars.functions = Ows.getXPathValueList(node,
        '//ogc:FunctionNames/ogc:FunctionName');
};

Ows.Csw = function(url) {
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
            this.xml = Ows.loadXMLDoc(
                Ows.Util.buildUrl(this.url, params));
        } catch (err2) {
            console.debug('Fetching url with no params (static doc)');
            this.xml = Ows.loadXMLDoc(this.url, params);
        }
    } catch(err) {  // string
        console.error(err);
        this.xml = Ows.loadXMLString(this.url, params);
    }
    // TODO: error checking, etc.

    // get main sections and parse them (TODO)
    console.debug('Procesing ows:ServiceIdentificaiton');
    node = Ows.getXPathNode(this.xml, '//ows:ServiceIdentification');
    this.identification = new Ows.Ows.ServiceIdentification(node);

    console.debug('Procesing ows:ServiceProvider');
    node = Ows.getXPathNode(this.xml, '//ows:ServiceProvider');
    this.provider = new Ows.Ows.ServiceProvider(node);

    console.debug('Procesing ows:OpeartionsMetadata');
    node = Ows.getXPathNode(this.xml, '//ows:OperationsMetadata');
    this.operationsmetadata = new Ows.Ows.OperationsMetadata(node);

    console.debug('Procesing ogc:Filter_Capabilities');
    node = Ows.getXPathNode(this.xml, '//ogc:Filter_Capabilities');
    this.filtercapabilities = new Ows.Fes.FilterCapabilities(node);
};

Ows.Csw.prototype.GetRecords = function() {
    return 'GetRecords called';
};

Ows.Csw.prototype.GetRecordById = function(id_list, esn,
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
    this.xml = Ows.loadXMLDoc(Ows.Util.buildUrl(url, params));
};

Ows.Csw.prototype.getOperationByName = function(name) {
    for(var i = 0; i < this.operationsmetadata.operations.length; i++) {
        var opname = this.operationsmetadata.operations[i].name.toLowerCase();
        if (name.toLowerCase() === opname) {
            return this.operationsmetadata.operations[i];
        }
    }
    return false;
};

// util functions

Ows.loadXMLDoc = function(url) {
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
            httpRequest = this.Util.httpGet(Ows.Proxy + url);
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

Ows.loadXMLString = function(txt) {
    var parser = null;
    var xmlDoc = null;

    if (Ows.NOTIE) {
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

Ows.Util.httpGet = function(url) {
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

Ows.Util.httpPost = function(url, lang, request) {
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

Ows.Util.buildUrl = function(url, params) {
    var kvps = [];

    for (var key in params) {
        if (params[key] !== null) {
            kvps.push(key+'='+params[key]); 
        }
    }
    return url + escape('?' + kvps.join('&'));
};
