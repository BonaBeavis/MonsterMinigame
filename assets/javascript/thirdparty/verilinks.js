"use strict"

window.$J = jQuery.noConflict();

var Verilinks = function(linkset, templateId, user, verilinksServerUrl) {
    function init() {
        requestTemplate();
    }

    function requestTemplate(templateId) {
        $J.get(verilinksServerUrl + "server?service=getTemplate&template=" +
            templateId,
            function(template) {
                $J.templates({
                    templateId: template
                });
                alert(template);
            });
    }

}

//// map helper
//var lati = 0;
//var longi = 0;
//var isMap = false;

//// constants
//var TRUE = 1;
//var FALSE = 0;
//var UNSURE = -1;
//var EVAL_POSITIVE = 1;
//var EVAL_NEGATIVE = -1;
//var EVAL_UNSURE = 0;
//var EVAL_FIRST = -2;
//var EVAL_ERROR = -1111;
//var EVAL_THRESHOLD = 0.3;
//var CONTAINER = 'verilinks';

//var link = null;
//// template for rendering
//var template = null;
//// array of all already verified links
//var verifiedLinks = [];
//// array of current verified links
//var verifiedLinksCurrent = [];

//var prevLinkEval;

//var locked = true;

//var startOfGame = true;
//// Standart timeout after verification is 1.3s
//var timeout = 1300;
//var timeoutObject;

//function init() {
//templateRequest();
//linkRequest(generateURL(), function() {
//loadMap();
//VERILINKS.lock();
//startOfGame = false;
//});
//}

//// ajax call to get new link, draw link as callback
//var linkRequest = function(req, callback) {
//var xmlHttp = new XMLHttpRequest();
//xmlHttp.onreadystatechange = function() {
//if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//if (xmlHttp.responseText == "Not found") {
//alert("Error: Receiving Link!");
//} else {
//var data = "(" + xmlHttp.responseText + ")";
//handleLink(data);
//callback();
//}
//}
//}
//xmlHttp.open("GET", req, true);
//xmlHttp.send(null);

//// alert(req);
//// ERROR in Chrome ----------- fallback to native js
//// $J.ajax({
//// url : req,
//// success : function(data) {
//// handleLink(data);
//// if (callback != undefined && typeof callback == 'function')
//// callback();
//// },
//// error : function(jqXHR, textStatus, errorThrown) {
//// alert("Error getting Link: " + textStatus.toString);
//// return null;
//// }
//// });
//}

//var handleLink = function(data) {
//link = new Link(data);
//render(data);
//}

//[>* Objects *<]
//var Link = function(json) {
//// var link = jQuery.parseJSON(json);
//var link = json;
//this.id = link.id;
//this.predicate = link.predicate;
//this.subject = new Instance(link.subject, "subject");
//this.object = new Instance(link.object, "object");
//prevLinkEval = link.prevLinkEval;
//}

//var Instance = function(instance, div) {
//this.uri = instance.uri;
//this.properties = instance.properties;
//this.long = null;
//this.lat = null;
//var prop;
//var value;
//var desc;
//var pic;
//for (var i = 0; i < this.properties.length; ++i) {
//prop = this.properties[i].property;
//value = this.properties[i].value;
//if (prop == '<http://www.w3.org/2003/01/geo/wgs84_pos#lat>' &&
//value.length > 0)
//this.lat = value;
//if (prop ==
//'<http://www.w3.org/2003/01/geo/wgs84_pos#long>' &&
//value.length > 0)
//this.long = value;
//}
//}


//Instance.prototype.getProperty = function(search) {
//var prop;
//var value;
//for (var i = 0; i < this.properties.length; ++i) {
//prop = this.properties[i].property;
//value = this.properties[i].value;
//if (prop == search && value.length > 0)
//return value;
//}
//return null;
//};

//var Verification = function(linkId, linkVerification) {
//this.id = linkId;
//this.veri = linkVerification;
//}

//var Commit = function() {
//this.user = user;
//this.verification = verifiedLinksCurrent;
//}

//var loadMap = function(callback) {
//if (!isMap)
//return;
//var div = 'object';
//var mapDiv = "map_" + div;
//if ($J("#" + mapDiv).length === 0) {
//$J("#" + div).append(
//"<div id='map' style='width:380px;height:200px;'></div>"
//);
//} else {
//$J("#" + mapDiv).html("");
//}
//var map = new OpenLayers.Map("map");
//var mapnik = new OpenLayers.Layer.OSM();
//var fromProjection = new OpenLayers.Projection("EPSG:4326");
//// Transform from WGS 1984
//var toProjection = new OpenLayers.Projection("EPSG:900913");
//// to Spherical Mercator Projection
//var position = new OpenLayers.LonLat(parseFloat(longi),
//parseFloat(lati)).transform(fromProjection,
//toProjection);
//var zoom = 5;

//map.addLayer(mapnik);

//markers = new OpenLayers.Layer.Markers("Cities");
//map.addLayer(markers);
//markers.clearMarkers();

//var size = new OpenLayers.Size(21, 25);
//var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
//var icon = new OpenLayers.Icon(
//'http://www.openlayers.org/dev/img/marker.png', size,
//offset);
//markers.addMarker(new OpenLayers.Marker(position, icon.clone()));

//map.setCenter(position, zoom);

//// callback
//if (callback !== undefined && typeof callback == 'function') {
//callback();
//}
//}

//// draw link
//var render = function(data) {
//$J("#" + CONTAINER).html($J("#template").render(data));
//VERILINKS.lock();
//timer();
//}

//var templateRequest = function(templateId) {
//var url = verilinksServerUrl + "server?service=getTemplate&template=" +
//templateId;
//// $J.ajax({
//// url : url,
//// success : function(data) {
//// // alert(data);
//// $J('#template').html(data);
//// if (callback != undefined && typeof callback == 'function')
//// callback();
//// }
//// });
//$J('#template').load(verilinksServerUrl + "server?service=getTemplate&template=" +
//templateId;);
//}

//[>* Check request params and generate Request URL <]
//var generateURL = function(verification) {
//var url = SERVER_URL + "server?service=getLink"
//if (user === null) {
//alert("user missing");
//return null;
//}
//if (user.name.length === 0) {
//alert("userName missing");
//return null;
//} else
//url += "&userName=" + user.name;
//if (user.id.length === 0) {
//alert("userId missing");
//return null;
//} else
//url += "&userId=" + user.id;
//if (link !== null) {
//url += "&curLink=" + link.id;
//}
//if (linkset === null || linkset.length === 0)
//return null;
//else
//url += "&linkset=" + linkset;
//if (getVerifiedLinks() !== null)
//url += "&verifiedLinks=" + getVerifiedLinks();
//url += "&nextLink=" + getNextLink();
//if (verification !== null)
//url += "&verification=" + verification;
//// alert(url);
//return url;
//}

//var getNextLink = function() {
//var min = 4;
//var max = 6;
//var rnd = Math.floor((Math.random() * max) + min);
//var nextLink = (verifiedLinks.length % rnd == rnd - 1);
//return false;
//}

//var getVerifiedLinks = function() {
//if (verifiedLinks === null || verifiedLinks.length === 0)
//return null;
//var param = "";
//for (var i = 0; i < verifiedLinks.length; i++) {
//param += verifiedLinks[i].id;
//if (i != (verifiedLinks.length - 1))
//param += "+";
//}
//return param;
//}

//// function Statistics(){
//// this.agree = 0;
//// this.agree=0;
//// this.disagree=0;
//// this.penalty=0;
//// this.unsure=0;
//// this.verification = new Array();
//// }

//// Verify link afterwards get new link and insert into verilinksComponent
//var verify = function(verification) {
//if (locked)
//return;
//// add to verifiedLinks array
//var duplicate = false;
//// search for duplicates in array
//// for (var i = 0; i < verifiedLinks.length; i++) {
//// if (link.id == verifiedLinks[i]) {
//// duplicate = true;
//// break;
//// }
//// }
//if (!duplicate) {
//var veri = new Verification(link.id, verification);
//verifiedLinks.push(veri);
//verifiedLinksCurrent.push(veri);
//}

//linkRequest(generateURL(verification), loadMap);
//}

//var timer = function() {
//if (!startOfGame)
//timeoutObject = setTimeout(VERILINKS.unlock(), timeout);
//}

//return {
//// Get evaluation of previous link-verification
//getEval: function() {
//var evaluation = "No verification done";
//if (prevLinkEval == EVAL_FIRST)
//evaluation = "first";
//else if (prevLinkEval == EVAL_NEGATIVE)
//evaluation = "penalty";
//else if (prevLinkEval == EVAL_UNSURE)
//evaluation = "unsure";
//else if (prevLinkEval == EVAL_POSITIVE || prevLinkEval >
//EVAL_THRESHOLD)
//evaluation = "agreement";
//else if (prevLinkEval <= EVAL_THRESHOLD)
//evaluation = "disagreement";
//// alert(eval);
//return evaluation;
//},
//// Commit user's verification
//commit: function() {
//clearTimeout(timeoutObject);
//var url = SERVER_URL +
//"server?service=commitVerifications";
//var obj = new Commit();
//var json = JSON.stringify(obj);
//$J.ajax({
//type: 'POST',
//url: url,
//data: json,
//success: function(data) {
//// alert("commit: " + data);
//verifiedLinksCurrent.length = 0;
//},
//error: function(jqXHR, textStatus,
//errorThrown) {
//alert("Error: " + errorThrown);
//verifiedLinksCurrent.length = 0;
//}
//});
//return "Commit";
//},
//isLocked: function() {
//return locked;
//},
//lock: function() {
//locked = true;
//$J(".lock").css({
//opacity: 0.3
//});
//// $J("#start").removeAttr('disabled');
//},
//lockVerify: function() {
//locked = true;
//$J(".lock").css({
//opacity: 0.3
//});
//$J("#start").removeAttr('disabled');
//},
//unlock: function() {
//locked = false;
//$J(".lock").css({
//opacity: 1
//});
//$J("#start").attr('disabled', 'disabled');
//},
//vTrue: function() {
//verify(TRUE);
//},
//vFalse: function() {
//verify(FALSE);
//},
//vUnsure: function() {
//verify(UNSURE);
//},
//setTimeout: function(time) {
//timeout = time;
//},
//setLat: function(val) {
//lati = val;
//},
//setLong: function(val) {
//longi = val;
//},
//setIsMap: function(val) {
//isMap = val;
//}
//};
//};
