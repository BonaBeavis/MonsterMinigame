VERILINKS = (function() {

	// map helper
	var lati = 0;
	var longi = 0;
	var isMap = false;

	// constants
	const TRUE = 1;
	const FALSE = 0;
	const UNSURE = -1;
	const EVAL_POSITIVE = 1;
	const EVAL_NEGATIVE = -1;
	const EVAL_UNSURE = 0;
	const EVAL_FIRST = -2;
	const EVAL_ERROR = -1111;
	const EVAL_THRESHOLD = 0.3;
	const CONTAINER ='verilinks';
	
	// const SERVER_URL = "http://localhost:8080/verilinks-server/";
	// const SERVER_URL = "/verilinks-server/server";
	const SERVER_URL = "http://verilinks.aksw.org/";
	var link = null;
	// template for rendering
	var template = null;
	// array of all already verified links
	var verifiedLinks = [];
	// array of current verified links
	var verifiedLinksCurrent = [];

	var user = null;
	var linkset = null;

	var prevLinkEval;

	var locked = true;

	var startOfGame = true;
	// Standart timeout after verification is 1.3s
	var timeout = 1300;
	var timeoutObject;

	window.onload = function() {
		insertScript(init);
	};

	function init() {
		login();
		templateRequest();
		linkRequest(generateURL(), function() {
			loadMap();
			VERILINKS.lock();
			startOfGame = false;
		});
	}

	// TODO: any other way to realize script insertion?
	function insertScript(callback) {
		var headID = document.getElementsByTagName("head")[0];
		// jQuery
		var jqueryScript = document.createElement('script');
		jqueryScript.type = 'text/javascript';
		jqueryScript.src = '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';
		jqueryScript.onload = function() {
			// openlayers
			var mapScript = document.createElement('script');
			mapScript.src = 'http://www.openlayers.org/api/OpenLayers.js';
			mapScript.onload = function() {
				// jsrender
				var jsrenderScript = document.createElement('script');
				jsrenderScript.src = 'https://raw.github.com/BorisMoore/jsrender/master/jsrender.js';
				jsrenderScript.type = 'text/javascript';
				jsrenderScript.onload = function() {
					// jsrScript
					var jsrScript = document.createElement('script');
					jsrScript.type = 'text/x-jsrender';
					jsrScript.id = 'template';
					headID.appendChild(jsrScript);
					// jsr helper
					var helperScript = document.createElement('script');
					helperScript.type = 'text/javascript';
					headID.appendChild(helperScript);
					var code = "$.views.helpers({setLat : function(val) {VERILINKS.setLat(val);VERILINKS.setIsMap(true);},setLong : function(val) {VERILINKS.setLong(val);}});"
					helperScript.text = code;
					// callback
					if (callback != undefined && typeof callback == 'function')
						callback();
				}
				headID.appendChild(jsrenderScript);
			};
			headID.appendChild(mapScript);
		}
		headID.appendChild(jqueryScript);
	}

	// ajax call to get new link, draw link as callback
	function linkRequest(req, callback) {
		if (req == null) {
			alert("Can't request link!");
			return null;
		}

		xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				if (xmlHttp.responseText == "Not found") {
					alert("Error: Receiving Link!");
				} else {
					var data = eval("(" + xmlHttp.responseText + ")");
					handleLink(data);
					if (callback != undefined && typeof callback == 'function')
						callback();
				}
			}
		}
		xmlHttp.open("GET", req, true);
		xmlHttp.send(null);

		// alert(req);
		// ERROR in Chrome ----------- fallback to native js
		// $.ajax({
		// url : req,
		// success : function(data) {
		// handleLink(data);
		// if (callback != undefined && typeof callback == 'function')
		// callback();
		// },
		// error : function(jqXHR, textStatus, errorThrown) {
		// alert("Error getting Link: " + textStatus.toString);
		// return null;
		// }
		// });
	}

	function handleLink(data) {
		link = new Link(data);
		render(data);
	}

	/** Objects **/
	function Link(json) {
		// var link = jQuery.parseJSON(json);
		var link = json;
		this.id = link.id;
		this.predicate = link.predicate;
		this.subject = new Instance(link.subject, "subject");
		this.object = new Instance(link.object, "object");
		prevLinkEval = link.prevLinkEval;
	}

	function Instance(instance, div) {
		this.uri = instance.uri;
		this.properties = instance.properties;
		this.long = null;
		this.lat = null;
		var prop;
		var value;
		var desc;
		var pic;
		for (var i = 0; i < this.properties.length; ++i) {
			prop = this.properties[i].property;
			value = this.properties[i].value;
			if (prop == '<http://www.w3.org/2003/01/geo/wgs84_pos#lat>' && value.length > 0)
				this.lat = value;
			if (prop == '<http://www.w3.org/2003/01/geo/wgs84_pos#long>' && value.length > 0)
				this.long = value;
		}
	}


	Instance.prototype.getProperty = function(search) {
		var prop;
		var value;
		for (var i = 0; i < this.properties.length; ++i) {
			prop = this.properties[i].property;
			value = this.properties[i].value;
			if (prop == search && value.length > 0)
				return value;
		}
		return null;
	};

	function Verification(linkId, linkVerification) {
		this.id = linkId;
		this.veri = linkVerification;
	}

	function Commit() {
		this.user = user;
		this.verification = verifiedLinksCurrent;
	}

	function User(userId, userName) {
		this.id = userId;
		this.name = userName;
	}
	/* END */

	function loadMap(callback) {
		if (!isMap)
			return;
		var div = 'object';
		var mapDiv = "map_" + div;
		if ($("#" + mapDiv).length == 0) {
			$("#" + div).append("<div id='map' style='width:380px;height:200px;'></div>");
		} else {
			$("#" + mapDiv).html("");
		}
		var map = new OpenLayers.Map("map");
		var mapnik = new OpenLayers.Layer.OSM();
		var fromProjection = new OpenLayers.Projection("EPSG:4326");
		// Transform from WGS 1984
		var toProjection = new OpenLayers.Projection("EPSG:900913");
		// to Spherical Mercator Projection
		var position = new OpenLayers.LonLat(parseFloat(longi), parseFloat(lati)).transform(fromProjection, toProjection);
		var zoom = 5;

		map.addLayer(mapnik);

		markers = new OpenLayers.Layer.Markers("Cities");
		map.addLayer(markers);
		markers.clearMarkers();

		var size = new OpenLayers.Size(21, 25);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
		markers.addMarker(new OpenLayers.Marker(position, icon.clone()));

		map.setCenter(position, zoom);

		// callback
		if (callback != undefined && typeof callback == 'function') {
			callback();
		}
	}

	// draw link
	function render(data) {
		$("#"+CONTAINER).html($("#template").render(data));
		VERILINKS.lock();
		timer();
	}
	
	function templateRequest(templateId) {
		var tmpl;
		if(templateId==null)
			tmpl = "dbpedia-linkedgeodata";
		else
			tmpl=templateId;
		// var url = "http://localhost:8080/verilinks-server/server?service=getTemplate";
		// var url = SERVER_URL + "server?service=getTemplate";
		var url = SERVER_URL + "server?service=getTemplate&template="+tmpl;
		// $.ajax({
		// url : url,
		// success : function(data) {
		// // alert(data);
		// $('#template').html(data);
		// if (callback != undefined && typeof callback == 'function')
		// callback();
		// }
		// });
		$('#template').load(url);
	}

	/** Check request params and generate Request URL */
	function generateURL(verification) {
		var url = SERVER_URL + "server?service=getLink"
		if (user == null) {
			alert("user missing");
			return null;
		}
		if (user.name.length == 0) {
			alert("userName missing");
			return null;
		} else
			url += "&userName=" + user.name;
		if (user.id.length == 0) {
			alert("userId missing");
			return null;
		} else
			url += "&userId=" + user.id;
		if (link != null) {
			url += "&curLink=" + link.id;
		}
		if (linkset == null || linkset.length == 0)
			return null;
		else
			url += "&linkset=" + linkset;
		if (getVerifiedLinks() != null)
			url += "&verifiedLinks=" + getVerifiedLinks();
		url += "&nextLink=" + getNextLink();
		if (verification != null)
			url += "&verification=" + verification;
		// alert(url);
		return url;
	}

	function getNextLink() {
		var min = 4;
		var max = 6;
		var rnd = Math.floor((Math.random() * max) + min);
		if (verifiedLinks.length % rnd == rnd - 1) {
			nextLink = true;
		} else {
			nextLink = false;
		}
		return false;
	}

	function getVerifiedLinks() {
		if (verifiedLinks == null || verifiedLinks.length == 0)
			return null;
		var param = "";
		for (var i = 0; i < verifiedLinks.length; i++) {
			param += verifiedLinks[i].id;
			if (i != (verifiedLinks.length - 1))
				param += "+";
		}
		return param;
	}

	function login() {
		user = new User('FooID_ID', 'FooName')
		linkset = 'dbpedia-linkedgeodata';
	}

	// function Statistics(){
	// this.agree = 0;
	// this.agree=0;
	// this.disagree=0;
	// this.penalty=0;
	// this.unsure=0;
	// this.verification = new Array();
	// }

	// Verify link afterwards get new link and insert into verilinksComponent
	function verify(verification) {
		if (locked)
			return;
		// add to verifiedLinks array
		var duplicate = false;
		// search for duplicates in array
		// for (var i = 0; i < verifiedLinks.length; i++) {
		// if (link.id == verifiedLinks[i]) {
		// duplicate = true;
		// break;
		// }
		// }
		if (!duplicate) {
			var veri = new Verification(link.id, verification);
			verifiedLinks.push(veri);
			verifiedLinksCurrent.push(veri);
		}

		linkRequest(generateURL(verification), loadMap);
	}

	function timer() {
		if (!startOfGame)
			timeoutObject = setTimeout('VERILINKS.unlock()', timeout);
	}

	return {
		// Get evaluation of previous link-verification
		getEval : function() {
			var eval = "No verification done";
			if (prevLinkEval == EVAL_FIRST)
				eval = "first";
			else if (prevLinkEval == EVAL_NEGATIVE)
				eval = "penalty";
			else if (prevLinkEval == EVAL_UNSURE)
				eval = "unsure";
			else if (prevLinkEval == EVAL_POSITIVE || prevLinkEval > EVAL_THRESHOLD)
				eval = "agreement";
			else if (prevLinkEval <= EVAL_THRESHOLD)
				eval = "disagreement";
			// alert(eval);
			return eval;
		},
		// Commit user's verification
		commit : function() {
			clearTimeout(timeoutObject);
			var url = SERVER_URL + "server?service=commitVerifications";
			var obj = new Commit();
			var json = JSON.stringify(obj);
			$.ajax({
				type : 'POST',
				url : url,
				data : json,
				success : function(data) {
					// alert("commit: " + data);
					verifiedLinksCurrent.length = 0;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("Error: "+errorThrown);
					verifiedLinksCurrent.length = 0;
				}
			});
			return "Commit";
		},
		isLocked : function(){
			return locked;
		},
		lock : function() {
			locked = true;
			$(".lock").css({
				opacity : 0.3
			});
			// $("#start").removeAttr('disabled');
		},
		lockVerify : function() {
			locked = true;
			$(".lock").css({
				opacity : 0.3
			});
			$("#start").removeAttr('disabled');
		},
		unlock : function() {
			locked = false;
			$(".lock").css({
				opacity : 1
			});
			$("#start").attr('disabled', 'disabled');
		},
		vTrue : function() {
			verify(TRUE);
		},
		vFalse : function() {
			verify(FALSE);
		},
		vUnsure : function() {
			verify(UNSURE);
		},
		setTimeout : function(time){
			timeout=time;
		},
		setLat : function(val) {
			lati = val;
		},
		setLong : function(val) {
			longi = val;
		},
		setIsMap : function(val) {
			isMap = val;
		}
	};

})();
