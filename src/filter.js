Ows4js.Filter = function(){
    this.name = {
        key: "{http://www.opengis.net/ogc}Filter",
        localPart: "Filter",
        namespaceURI: "http://www.opengis.net/ogc",
        prefix: "ogc",
        string: "{http://www.opengis.net/ogc}ogc:Filter"
    };

    this.value = {
        TYPE_NAME: "Filter_1_1_0.FilterType"
        // logicOps : {}
        // spatialOps : {}
    }
};

Ows4js.Filter.prototype.PropertyName = function (propertyName){
    this.value.comparisonOps = {
        name : {
            key: "{http://www.opengis.net/ogc}PropertyIsLike",
            localPart: "PropertyIsLike",
            namespaceURI: "http://www.opengis.net/ogc",
            prefix: "ogc",
            string: "{http://www.opengis.net/ogc}ogc:PropertyIsLike"
        },
        value: {
            TYPE_NAME: "Filter_1_1_0.PropertyIsLikeType",
            //escapeChar: "",
            //singleChar: "_",
            //wildCard: "%",
            literal: {
                TYPE_NAME: "Filter_1_1_0.LiteralType",
                content: null
            },
            propertyName: {
                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                content: propertyName
            }
        }
    };
    return this;
};

// Comparison Operators
Ows4js.Filter.prototype.isLike = function(value){
    this.value.comparisonOps.value.literal.content = [value];
    this.value.comparisonOps.value.escapeChar =  '';
    this.value.comparisonOps.value.singleChar= '_';
    this.value.comparisonOps.value.wildCard = '%';
    return this;
};

Ows4js.Filter.prototype.isNull = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isNill = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isBetween = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isEqualTo = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isLessThanEqualTo = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isGreaterThan = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isLessThan = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isGreaterThanEqualTo = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isNotEqualTo = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.isNullCheck = function(filter){
    throw 'Not Implemented yet';
};

// Logical Operators

Ows4js.Filter.prototype.and = function(filter){
    if (typeof this.value.logicOps === 'undefined') {
        console.debug('The first And');
        this.value.logicOps = {
            name: {
                key: "{http://www.opengis.net/ogc}And",
                localPart: "And",
                namespaceURI: "http://www.opengis.net/ogc",
                prefix: "ogc",
                string: "{http://www.opengis.net/ogc}ogc:And"
            },
            value: {
                TYPE_NAME: "Filter_1_1_0.BinaryLogicOpType"
            }
        };
        /**
         *   TODO We need to check if the filter/operator is a
         *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
         *   (comparisonOps), ArithmeticOperators or is a composition of them
         *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
         *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
         */
        if (typeof this.value.comparisonOps !== 'undefined') {
            // Only has one previous filter and it is a comparison operator.
            this.value.logicOps.value.comparisonOpsOrSpatialOpsOrLogicOps = [this.value.comparisonOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this.value.comparisonOps;
        } else if (typeof this.value.spatialOps !== 'undefined'){
            // Only has one previous filter and it is a spatial operator.
            this.value.logicOps.value.comparisonOpsOrSpatialOpsOrLogicOps = [this.value.spatialOps].concat(Ows4js.Filter.getPreviousOperator(filter));
            delete this.value.spatialOps;
        } else {
            throw 'Not Implemented yet, another operators';
        }
    } else {
        // It has two or more previous operators.
        this.value.logicOps.value.comparisonOpsOrSpatialOpsOrLogicOps = this.value.logicOps.value.comparisonOpsOrSpatialOpsOrLogicOps.concat(Ows4js.Filter.getPreviousOperator(filter));
    }
    return this;
};//*/

Ows4js.Filter.getPreviousOperator = function(filter){
    var operator;
    if (typeof filter.value.comparisonOps !== 'undefined') {
        // Only has one previous filter and it is a comparison operator.
        operator = filter.value.comparisonOps;
    } else if (typeof filter.value.spatialOps !== 'undefined'){
        // Only has one previous filter and it is a spatial operator.
        operator = filter.value.spatialOps;
    } else {
        throw 'Not Implemented yet, another operators';
    }
    return operator;
};

Ows4js.Filter.prototype.or = function(filter){
    throw 'Not Implemented yet';
};

Ows4js.Filter.prototype.not = function(filter){
    throw 'Not Implemented yet';
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
    this.value.spatialOps = {
        name: {
            key: "{http://www.opengis.net/ogc}BBOX",
            localPart: "BBOX",
            namespaceURI: "http://www.opengis.net/ogc",
            prefix: "ogc",
            string: "{http://www.opengis.net/ogc}ogc:BBOX"
        },
        value :{
            TYPE_NAME: "Filter_1_1_0.BBOXType",
            envelope : {
                name :{
                    key: "{http://www.opengis.net/gml}Envelope",
                    localPart: "Envelope",
                    namespaceURI: "http://www.opengis.net/gml",
                    prefix: "gml",
                    string: "{http://www.opengis.net/gml}gml:Envelope"
                },
                value : {
                    TYPE_NAME: "GML_3_1_1.EnvelopeType",
                    //srsName: "urn:x-ogc:def:crs:EPSG:6.11:4326",
                    srsName: srsName,
                    lowerCorner: {
                        TYPE_NAME: "GML_3_1_1.DirectPositionType",
                        value : [llat, llon]
                    },
                    upperCorner : {
                        TYPE_NAME: "GML_3_1_1.DirectPositionType",
                        value : [ulat, ulon]
                    }
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
Ows4js.Filter.JsonixContext = new Jsonix.Context([OWS_1_0_0, DC_1_1, DCT, XLink_1_0,  SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, Filter_1_1_0, CSW_2_0_2]);

Ows4js.Filter.prototype.getXML = function(){
    var doc;
    var marshaller= Ows4js.Filter.JsonixContext.createMarshaller();
    doc = marshaller.marshalDocument(this);
    return doc;
};