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
                ops: []
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
                ops: []
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