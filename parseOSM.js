/*
 * 
 * 
 *  Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved 
 * 
 *   Parse Open Street Maps file
 *   cody smith
 *   
 *   requires jquery to be loaded first
 *   
 *    function drawMap(canvas) 
 *    initXML(filename, doneCallback) 
 */
//globals
var xmlData = null;
var _bounds = {};
var _ang2rad = Math.PI / 360.0;




function initXML(filename, doneCallback) {
	// load open street maps .osm xml file
	logIt("initXML called");

	// handle the ajax
	// load all the files
	$.ajax( {
		type : "GET",
		url : filename,
		dataType : "xml",
		success : function(xml) {
			logIt("success loading xml");
			xmlData = xml;
			parseOSM(xmlData);
			doneCallback();
		}
	});
	$(document).ajaxError(function(event, request, settings){
		  logIt("Error requesting page " + settings.url + "<br> This is probably due to the same origin policy <br> Make sure this is running from a web server",1);
		});

	function parseOSM(xml) {
		//
		// read _bounds
		//
		var c = xmlData.getElementsByTagName('bounds');
		if (!c) {
			logIt(" ERROR no bounds tag found", 1);
		}
		// save some important data concerning the osm
		c = c[0]; // it is an array. take the first element
		_bounds.minlon = Number(c.getAttribute('minlon'));
		_bounds.minlat = Number(c.getAttribute('minlat'));
		_bounds.maxlon = Number(c.getAttribute('maxlon'));
		_bounds.maxlat = Number(c.getAttribute('maxlat'));
		_bounds.width = _bounds.maxlon - _bounds.minlon;
		_bounds.height = _bounds.maxlat - _bounds.minlat;
		_bounds.nodeCount = xmlData.getElementsByTagName('node').length;
		_bounds.wayCount = xmlData.getElementsByTagName('way').length;

		// log
		logIt(_bounds.nodeCount + " nodes, " + xmlData.getElementsByTagName('role').length + " roles, " + _bounds.wayCount + " ways");
		logIt(xmlData.getElementsByTagName('relation').length + " relations, " + xmlData.getElementsByTagName('member').length + " members, " + xmlData.getElementsByTagName('tag').length + " tags");

		// collect nodes
		var tagsTmp=[], tagType;
		var xNodes = xmlData.getElementsByTagName('node');
		for ( var i = 0; i < xNodes.length; i++) {
			var tmp = xNodes[i];
			var newNode = new node(tmp.getAttribute('id'), tmp
					.getAttribute('lat'), tmp.getAttribute('lon'), _bounds);
			
			tagsTmp = tmp.getElementsByTagName('tag');
			for( var i2 = 0 ; i2 < tagsTmp.length; i2++){
				tagType = tagsTmp[i2].getAttribute('k');
				if(tagType == "amenity")
					newNode.type="amenity";
				if(tagType == "shop")
					newNode.type="amenity";
				if(tagType == "tourism")
					newNode.type="tourism";
			}
			// i think this puts it in a hash table
			_nodes.insert( newNode);
			//_nodes[newNode.id] = newNode;
			//_nodes.list.push(newNode.id);
		}

		//
		// find roads and paths save them as edges inside each node
		var xmlways = xmlData.getElementsByTagName('way');
		var wa = null;
		var watags;
		var isHighway = false;

		// 
		// go through all of the ways.
		// they could be a lot of things. coasts, roads, bridges, bus lines,
		// buildings.....
		//
		for (i = 0; i < xmlways.length; i++) {
			isHighway = false;
			wa = xmlways[i];

			// look for highway tag
			// <tag k="highway" v="pedestrian">
			watags = wa.getElementsByTagName('tag');
			for ( var j = 0; j < watags.length; j++) {
				tmp = watags[j];
				if (tmp.getAttribute('k') == 'highway') {
					isHighway = true;
				}
			}
			// if a highway tag was found it is good.
			// i'm currently only interested in highways. (they include bridges
			// and footpaths.)
			if (isHighway) {
				var wayNodes = wa.getElementsByTagName('nd');
				var nodeId, prevnodeId, nextnodeId;
				for (j = 0; j < wayNodes.length; j++) {
					nodeId = wayNodes[j].getAttribute('ref');
					_nodes[nodeId].type = "way";
					// if its not the first element on a way
					if (j != 0) {
						prevnodeId = wayNodes[j - 1].getAttribute('ref');
						_nodes[nodeId].addEdge(prevnodeId);
					}
					// if its not the last element on a way
					if (j < wayNodes.length - 1) {
						nextnodeId = wayNodes[j + 1].getAttribute('ref');
						_nodes[nodeId].addEdge(nextnodeId);
					}
				}// ..j
			}// ...if highway
		}// ...i ways
	}// parse osm
}// ...initXML

//___________________________________________
// draw map
//___________________________________________
function drawMap(canvas) {

	logIt('drawMap called')
	//TODO: make this store the canvas 
	if (!canvas){
			canvas = document.getElementsByClassName('mapCanvas');
	}
	if( !canvas || canvas.length <= 0){
		logIt("ERROR: can't draw with out a canvas specified", 1);
		return;
	}
	if(canvas.length > 0)
		canvas = canvas[0];
	// prepare the canvas
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "rgb(200,0,0)";
	var Wid = canvas.width;
	var Hei = canvas.height;
	var nd = null;
	var ndName = null, neighbor = null;

	//
	// Draw some edges
	for ( var i = 0; i < _nodes.list.length; i++) {
		ndName = _nodes.list[i];
		nd = _nodes[ndName];
		// draw edges
		ctx.beginPath();
		for ( var n = 0; n < nd.edges.length; n++) {
			if(nd.distances){
				ctx.strokeStyle = "rgb(0,255,0)";
				ctx.lineWidth = 2;
			}
			else{
				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.lineWidth = 1;
			}
			
			ctx.moveTo(nd.x * Wid, nd.y * Hei);
			neighbor = _nodes[nd.edges[n]];
			ctx.lineTo(neighbor.x * Wid, neighbor.y * Hei);
		}
		ctx.stroke();
	}
	//
	// Draw some nodes
	for (  i = 0; i < _nodes.list.length; i++) {
		ndName = _nodes.list[i];
		nd = _nodes[ndName];
		if(nd.type == "way"){
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 2, 2);
		}
		else if(nd.type == "amenity"){
			ctx.fillStyle = "rgb(200,100,0)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 5, 5);
		}
		else if(nd.type == "tourism"){
			ctx.fillStyle = "rgb(255,50,10)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 5, 5);
		}
		else if(nd.type == "bar"){
			ctx.fillStyle = "rgba(100,255,10,0.7)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 10, 10);
		}
		else if(nd.type == "hotel"){
			ctx.fillStyle = "rgba(100,200,10,0.7)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 20, 10);
		}
		else{
			ctx.fillStyle = "rgb(0,64,0)";
			ctx.fillRect(nd.x * Wid, nd.y * Hei, 2, 2);
		}
	}
}

